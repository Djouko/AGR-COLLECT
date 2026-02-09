// Copyright 2025 AGR-Collect Developers
// Sites API endpoints for AGR-Collect

const { Site, Blob } = require('../model/frames');
const { getOrNotFound, reject } = require('../util/promise');
const { success } = require('../util/http');
const { QueryOptions } = require('../util/db');
const Problem = require('../util/problem');
const { blobResponse, defaultMimetypeFor } = require('../util/blob');

module.exports = (service, endpoint) => {

  ////////////////////////////////////////////////////////////////////////////////
  // GLOBAL SITES ENDPOINTS

  // Get all sites (with optional filters) - accessible to authenticated users
  service.get('/sites', endpoint(async ({ Sites }, { auth, query, queryOptions }) => {
    // Check if user is authenticated (has any role)
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    
    let sites;
    if (query.projectId) {
      sites = await Sites.getAllByProjectId(parseInt(query.projectId), queryOptions);
    } else if (query.region) {
      sites = await Sites.getByRegion(query.region, queryOptions);
    } else if (query.status) {
      sites = await Sites.getByStatus(query.status, queryOptions);
    } else {
      sites = await Sites.getAll(queryOptions);
    }
    
    return sites;
  }));

  // Get global site statistics
  service.get('/sites/stats', endpoint(async ({ Sites }, { auth }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    return Sites.getGlobalStats();
  }));

  // Get all distinct regions
  service.get('/sites/regions', endpoint(async ({ Sites }, { auth, query }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    return Sites.getRegions(query.projectId ? parseInt(query.projectId) : null);
  }));

  // Get sites within bounds (for map)
  service.get('/sites/bounds', endpoint(async ({ Sites }, { auth, query }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    
    const { minLat, maxLat, minLng, maxLng, projectId } = query;
    if (!minLat || !maxLat || !minLng || !maxLng) {
      return reject(Problem.user.missingParameter({ field: 'bounds (minLat, maxLat, minLng, maxLng)' }));
    }
    
    return Sites.getWithinBounds(
      parseFloat(minLat), parseFloat(maxLat),
      parseFloat(minLng), parseFloat(maxLng),
      projectId ? parseInt(projectId) : null
    );
  }));

  // Get single site by ID
  service.get('/sites/:id', endpoint(async ({ Sites }, { auth, params, queryOptions }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id), queryOptions);
    return getOrNotFound(site);
  }));

  // Create a new site (global)
  service.post('/sites', endpoint(async ({ Projects, Sites }, { auth, body }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    
    const siteData = Site.fromApi(body);
    if (!siteData.projectId) {
      return reject(Problem.user.missingParameter({ field: 'projectId' }));
    }
    if (!siteData.name) {
      return reject(Problem.user.missingParameter({ field: 'name' }));
    }
    
    // Check permission on the project (use project.update for site creation)
    const project = await Projects.getById(siteData.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);
    
    return Sites.create(siteData.with({ createdBy: auth.actor.map(a => a.id).orNull() }));
  }));

  // Update a site
  service.patch('/sites/:id', endpoint(async ({ Projects, Sites }, { auth, params, body }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    
    // Check permission on the project (use project.update for site modification)
    const project = await Projects.getById(site.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);
    
    return Sites.update(site, Site.fromApi(body));
  }));

  // Delete a site
  service.delete('/sites/:id', endpoint(async ({ Projects, Sites }, { auth, params }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    
    // Check permission on the project (use project.update for site deletion)
    const project = await Projects.getById(site.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);
    
    await Sites.del(site);
    return success();
  }));

  ////////////////////////////////////////////////////////////////////////////////
  // SITE MEDIA ENDPOINTS

  // Get media for a site
  service.get('/sites/:id/media', endpoint(async ({ Sites }, { auth, params }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    return Sites.getMediaBySiteId(site.id);
  }));

  // Add media to a site (binary upload like ODK attachments)
  service.post('/sites/:id/media/:filename', endpoint(async ({ Blobs, Projects, Sites }, { auth, params, headers }, request) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    
    // Check permission on the project (use project.update for media upload)
    const project = await Projects.getById(site.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);

    // Handle file upload using ODK Central pattern (request is 3rd argument)
    const contentType = headers['content-type'] || defaultMimetypeFor(params.filename);
    const blobId = await Blob.fromStream(request, contentType).then(Blobs.ensure);
    
    const type = contentType.startsWith('video/') ? 'video' : 'image';
    return Sites.addMedia(
      parseInt(params.id),
      blobId,
      params.filename,
      type,
      contentType
    );
  }));

  // Get a specific media content (binary download)
  service.get('/sites/:id/media/:mediaId/content', endpoint(async ({ s3, Blobs, Sites }, { auth, params }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    const mediaList = await Sites.getMediaBySiteId(site.id);
    const media = mediaList.find(m => m.id === parseInt(params.mediaId));
    if (!media) return reject(Problem.user.notFound());
    
    const blob = await Blobs.getById(media.blobId).then(getOrNotFound);
    return blobResponse(s3, media.name, blob);
  }));

  // Delete media from a site
  service.delete('/sites/:id/media/:mediaId', endpoint(async ({ Projects, Sites }, { auth, params }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    
    // Check permission on the project (use project.update for media deletion)
    const project = await Projects.getById(site.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);
    
    await Sites.deleteMedia(parseInt(params.mediaId));
    return success();
  }));

  ////////////////////////////////////////////////////////////////////////////////
  // SITE SUBMISSIONS ENDPOINTS

  // Get submissions linked to a site
  service.get('/sites/:id/submissions', endpoint(async ({ Sites }, { auth, params }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    return Sites.getSubmissionsBySiteId(site.id);
  }));

  // Link a submission to a site
  service.post('/sites/:id/submissions', endpoint(async ({ Projects, Sites }, { auth, params, body }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    
    // Check permission on the project (use project.update for submission linking)
    const project = await Projects.getById(site.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);

    if (!body.submissionId || !body.formId) {
      return reject(Problem.user.missingParameter({ field: 'submissionId and formId' }));
    }

    await Sites.linkSubmission(parseInt(params.id), parseInt(body.submissionId), parseInt(body.formId));
    return success();
  }));

  // Unlink a submission from a site
  service.delete('/sites/:id/submissions/:submissionId', endpoint(async ({ Projects, Sites }, { auth, params }) => {
    if (!auth.actor.isDefined()) {
      return reject(Problem.user.insufficientRights());
    }
    const site = await Sites.getById(parseInt(params.id)).then(getOrNotFound);
    
    // Check permission on the project (use project.update for submission unlinking)
    const project = await Projects.getById(site.projectId).then(getOrNotFound);
    await auth.canOrReject('project.update', project);
    
    await Sites.unlinkSubmission(site.id, parseInt(params.submissionId));
    return success();
  }));

  ////////////////////////////////////////////////////////////////////////////////
  // PROJECT-SCOPED SITES ENDPOINTS

  // Get sites for a specific project
  service.get('/projects/:projectId/sites', endpoint(async ({ Projects, Sites }, { auth, params, queryOptions }) => {
    const project = await Projects.getById(parseInt(params.projectId)).then(getOrNotFound);
    await auth.canOrReject('project.read', project);
    return Sites.getAllByProjectId(project.id, queryOptions);
  }));

  // Get site statistics for a project
  service.get('/projects/:projectId/sites/stats', endpoint(async ({ Projects, Sites }, { auth, params }) => {
    const project = await Projects.getById(parseInt(params.projectId)).then(getOrNotFound);
    await auth.canOrReject('project.read', project);
    return Sites.getStatsByProjectId(project.id);
  }));

  // Create a site within a project
  service.post('/projects/:projectId/sites', endpoint(async ({ Projects, Sites }, { auth, params, body }) => {
    const project = await Projects.getById(parseInt(params.projectId)).then(getOrNotFound);
    await auth.canOrReject('project.update', project);

    const siteData = Site.fromApi(body).with({ projectId: project.id });
    if (!siteData.name) {
      return reject(Problem.user.missingParameter({ field: 'name' }));
    }

    return Sites.create(siteData.with({ createdBy: auth.actor.map(a => a.id).orNull() }));
  }));

  // Get a specific site within a project
  service.get('/projects/:projectId/sites/:siteId', endpoint(async ({ Projects, Sites }, { auth, params, queryOptions }) => {
    const project = await Projects.getById(parseInt(params.projectId)).then(getOrNotFound);
    await auth.canOrReject('project.read', project);

    const site = await Sites.getById(parseInt(params.siteId), queryOptions).then(getOrNotFound);

    if (site.projectId !== project.id) {
      return reject(Problem.user.notFound());
    }

    return site;
  }));

  // Update a site within a project
  service.patch('/projects/:projectId/sites/:siteId', endpoint(async ({ Projects, Sites }, { auth, params, body }) => {
    const project = await Projects.getById(parseInt(params.projectId)).then(getOrNotFound);
    await auth.canOrReject('project.update', project);

    const site = await Sites.getById(parseInt(params.siteId)).then(getOrNotFound);

    if (site.projectId !== project.id) {
      return reject(Problem.user.notFound());
    }

    return Sites.update(site, Site.fromApi(body));
  }));

  // Delete a site within a project
  service.delete('/projects/:projectId/sites/:siteId', endpoint(async ({ Projects, Sites }, { auth, params }) => {
    const project = await Projects.getById(parseInt(params.projectId)).then(getOrNotFound);
    await auth.canOrReject('project.update', project);

    const site = await Sites.getById(parseInt(params.siteId)).then(getOrNotFound);

    if (site.projectId !== project.id) {
      return reject(Problem.user.notFound());
    }

    await Sites.del(site);
    return success();
  }));

};
