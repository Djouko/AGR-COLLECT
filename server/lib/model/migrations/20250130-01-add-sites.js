// Copyright 2025 AGR-Collect Developers
// Migration to add sites management tables

const { v4: uuid } = require('uuid');

const up = async (db) => {
  // Create the site actee species
  await db.insert({ id: 'site', species: 'species' }).into('actees');

  // Create the sites table
  await db.schema.createTable('sites', (sites) => {
    sites.increments('id');
    sites.integer('projectId').notNull();
    sites.text('name').notNull();
    sites.text('description');
    sites.decimal('latitude', 10, 7);
    sites.decimal('longitude', 10, 7);
    sites.decimal('altitude', 10, 2);
    sites.decimal('accuracy', 10, 2);
    sites.text('address');
    sites.text('region');
    sites.string('status', 20).notNull().defaultTo('active');
    sites.string('acteeId', 36).notNull().unique();
    sites.integer('createdBy');
    sites.dateTime('createdAt');
    sites.dateTime('updatedAt');
    sites.dateTime('deletedAt');

    sites.foreign('projectId').references('projects.id');
    sites.foreign('createdBy').references('actors.id');
  });

  // Create index for site lookups
  await db.raw('create index sites_projectid_idx on sites ("projectId")');
  await db.raw('create index sites_status_idx on sites ("status")');
  await db.raw('create index sites_region_idx on sites ("region")');
  await db.raw('create unique index sites_projectid_name_deletedat_unique on sites ("projectId", "name") where "deletedAt" is null');

  // Create site_media table for images and videos
  await db.schema.createTable('site_media', (media) => {
    media.increments('id');
    media.integer('siteId').notNull();
    media.integer('blobId').notNull();
    media.text('name').notNull();
    media.string('type', 20).notNull(); // 'image' or 'video'
    media.text('mimeType');
    media.text('description');
    media.dateTime('capturedAt');
    media.dateTime('createdAt');

    media.foreign('siteId').references('sites.id').onDelete('CASCADE');
    media.foreign('blobId').references('blobs.id');
  });

  await db.raw('create index site_media_siteid_idx on site_media ("siteId")');
  await db.raw('create index site_media_type_idx on site_media ("type")');

  // Create site_submissions table to link sites with submissions
  await db.schema.createTable('site_submissions', (ss) => {
    ss.integer('siteId').notNull();
    ss.integer('submissionId').notNull();
    ss.integer('formId').notNull();
    ss.dateTime('linkedAt');

    ss.primary(['siteId', 'submissionId']);
    ss.foreign('siteId').references('sites.id').onDelete('CASCADE');
    ss.foreign('submissionId').references('submissions.id').onDelete('CASCADE');
    ss.foreign('formId').references('forms.id');
  });

  await db.raw('create index site_submissions_siteid_idx on site_submissions ("siteId")');
  await db.raw('create index site_submissions_submissionid_idx on site_submissions ("submissionId")');
};

const down = async (db) => {
  // Drop tables in reverse order
  await db.schema.dropTableIfExists('site_submissions');
  await db.schema.dropTableIfExists('site_media');
  await db.schema.dropTableIfExists('sites');
  
  // Remove site actee species
  await db('actees').delete().where({ id: 'site', species: 'species' });
};

module.exports = { up, down };
