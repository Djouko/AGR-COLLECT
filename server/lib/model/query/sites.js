// Copyright 2025 AGR-Collect Developers
// Sites query module for AGR-Collect

const { sql } = require('slonik');
const { Site } = require('../frames');
const { extender, sqlEquals, insert, updater, markDeleted, QueryOptions } = require('../../util/db');
const { construct } = require('../../util/util');

////////////////////////////////////////////////////////////////////////////////
// CRUD

const create = (site) => ({ Actees, one }) =>
  Actees.provision('site')
    .then((actee) => one(insert(site.with({ acteeId: actee.id }))));

create.audit = (site, data) => (log) => log('site.create', site, { data });
create.audit.withResult = true;

const update = (site, data) => ({ one }) => 
  one(updater(site, data)).then(construct(Site));
update.audit = (site, data) => (log) => log('site.update', site, { data });

const del = (site) => ({ run }) => run(markDeleted(site));
del.audit = (site) => (log) => log('site.delete', site);

////////////////////////////////////////////////////////////////////////////////
// MEDIA

const addMedia = (siteId, blobId, name, type, mimeType) => ({ one }) =>
  one(sql`insert into site_media ("siteId", "blobId", "name", "type", "mimeType", "createdAt")
    values (${siteId}, ${blobId}, ${name}, ${type}, ${mimeType}, clock_timestamp())
    returning *`);

const getMediaBySiteId = (siteId) => ({ all }) =>
  all(sql`select sm.*, b.md5, b."contentType" 
    from site_media sm
    left join blobs b on b.id = sm."blobId"
    where sm."siteId" = ${siteId}
    order by sm."createdAt" desc`);

const deleteMedia = (mediaId) => ({ run }) =>
  run(sql`delete from site_media where id = ${mediaId}`);

////////////////////////////////////////////////////////////////////////////////
// SITE-SUBMISSION LINKS

const linkSubmission = (siteId, submissionId, formId) => ({ run }) =>
  run(sql`insert into site_submissions ("siteId", "submissionId", "formId", "linkedAt")
    values (${siteId}, ${submissionId}, ${formId}, ${new Date()})
    on conflict ("siteId", "submissionId") do nothing`);

const unlinkSubmission = (siteId, submissionId) => ({ run }) =>
  run(sql`delete from site_submissions where "siteId" = ${siteId} and "submissionId" = ${submissionId}`);

const getSubmissionsBySiteId = (siteId) => ({ all }) =>
  all(sql`select ss.*, s."instanceId", s."createdAt" as "submittedAt", s."reviewState",
      f.name as "formName", f."xmlFormId"
    from site_submissions ss
    inner join submissions s on s.id = ss."submissionId"
    inner join forms f on f.id = ss."formId"
    where ss."siteId" = ${siteId}
    order by s."createdAt" desc`);

////////////////////////////////////////////////////////////////////////////////
// GETTERS

const _getSql = ((fields, extend, options) => sql`
select ${fields} from sites
${extend || sql`
  left outer join
    (select "siteId", count(*)::integer as "submissionsCount", max(ss."linkedAt") as "lastActivity"
      from site_submissions ss
      group by "siteId") as sub_stats
    on sites.id = sub_stats."siteId"
  left outer join
    (select "siteId", count(*)::integer as "mediaCount"
      from site_media
      group by "siteId") as media_stats
    on sites.id = media_stats."siteId"`}
left join projects p on p.id = sites."projectId"
left join actors a on a.id = sites."createdBy"
where sites."deletedAt" is null and ${sqlEquals(options.condition)}
order by sites.name asc`);

const _get = extender(Site)(Site.Extended)(_getSql);

const getAll = (options = QueryOptions.none) => ({ all }) =>
  _get(all, options);

const getAllByProjectId = (projectId, options = QueryOptions.none) => ({ all }) =>
  _get(all, options.withCondition({ 'sites.projectId': projectId }));

const getById = (id, options = QueryOptions.none) => ({ maybeOne }) =>
  _get(maybeOne, options.withCondition({ 'sites.id': id }));

const getByProjectAndName = (projectId, name, options = QueryOptions.none) => ({ maybeOne }) =>
  _get(maybeOne, options.withCondition({ 'sites.projectId': projectId, 'sites.name': name }));

// Get sites by region
const getByRegion = (region, options = QueryOptions.none) => ({ all }) =>
  _get(all, options.withCondition({ 'sites.region': region }));

// Get sites by status
const getByStatus = (status, options = QueryOptions.none) => ({ all }) =>
  _get(all, options.withCondition({ 'sites.status': status }));

// Get sites within a bounding box (for map)
const getWithinBounds = (minLat, maxLat, minLng, maxLng, projectId = null) => ({ all }) => {
  const projectCondition = projectId ? sql`and sites."projectId" = ${projectId}` : sql``;
  return all(sql`
    select sites.*, p.name as "projectName",
      coalesce(sub_stats."submissionsCount", 0) as "submissionsCount",
      coalesce(media_stats."mediaCount", 0) as "mediaCount",
      sub_stats."lastActivity"
    from sites
    left join projects p on p.id = sites."projectId"
    left outer join
      (select "siteId", count(*)::integer as "submissionsCount", max("linkedAt") as "lastActivity"
        from site_submissions group by "siteId") as sub_stats
      on sites.id = sub_stats."siteId"
    left outer join
      (select "siteId", count(*)::integer as "mediaCount"
        from site_media group by "siteId") as media_stats
      on sites.id = media_stats."siteId"
    where sites."deletedAt" is null
      and sites.latitude between ${minLat} and ${maxLat}
      and sites.longitude between ${minLng} and ${maxLng}
      ${projectCondition}
    order by sites.name asc
  `);
};

// Get all distinct regions
const getRegions = (projectId = null) => ({ all }) => {
  const projectCondition = projectId ? sql`and "projectId" = ${projectId}` : sql``;
  return all(sql`
    select distinct region, count(*)::integer as "siteCount"
    from sites
    where "deletedAt" is null and region is not null ${projectCondition}
    group by region
    order by region asc
  `);
};

// Get site statistics for a project
const getStatsByProjectId = (projectId) => ({ one }) =>
  one(sql`
    select 
      count(*)::integer as "totalSites",
      count(*) filter (where status = 'active')::integer as "activeSites",
      count(*) filter (where status = 'inactive')::integer as "inactiveSites",
      count(*) filter (where status = 'pending')::integer as "pendingSites",
      coalesce(sum(sub_stats."submissionsCount"), 0)::integer as "totalSubmissions",
      coalesce(sum(media_stats."mediaCount"), 0)::integer as "totalMedia"
    from sites
    left outer join
      (select "siteId", count(*) as "submissionsCount" from site_submissions group by "siteId") as sub_stats
      on sites.id = sub_stats."siteId"
    left outer join
      (select "siteId", count(*) as "mediaCount" from site_media group by "siteId") as media_stats
      on sites.id = media_stats."siteId"
    where "projectId" = ${projectId} and "deletedAt" is null
  `);

// Get global site statistics
const getGlobalStats = () => ({ one }) =>
  one(sql`
    select 
      count(*)::integer as "totalSites",
      count(*) filter (where status = 'active')::integer as "activeSites",
      count(*) filter (where status = 'inactive')::integer as "inactiveSites",
      count(*) filter (where status = 'pending')::integer as "pendingSites",
      coalesce(sum(sub_stats."submissionsCount"), 0)::integer as "totalSubmissions",
      coalesce(sum(media_stats."mediaCount"), 0)::integer as "totalMedia"
    from sites
    left outer join
      (select "siteId", count(*) as "submissionsCount" from site_submissions group by "siteId") as sub_stats
      on sites.id = sub_stats."siteId"
    left outer join
      (select "siteId", count(*) as "mediaCount" from site_media group by "siteId") as media_stats
      on sites.id = media_stats."siteId"
    where "deletedAt" is null
  `);

module.exports = {
  create, update, del,
  addMedia, getMediaBySiteId, deleteMedia,
  linkSubmission, unlinkSubmission, getSubmissionsBySiteId,
  getAll, getAllByProjectId, getById, getByProjectAndName,
  getByRegion, getByStatus, getWithinBounds, getRegions,
  getStatsByProjectId, getGlobalStats
};
