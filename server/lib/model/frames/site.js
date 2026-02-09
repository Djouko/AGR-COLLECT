// Copyright 2025 AGR-Collect Developers
// Site management frame for AGR-Collect
// Gestion complète des sites de collecte de données

/* eslint-disable no-multi-spaces */

const { Frame, table, readable, writable, embedded, species } = require('../frame');

// Site frame - represents a data collection site
const Site = Frame.define(
  table('sites'), species('site'),
  'id',             readable,
  'projectId',      readable, writable,
  'name',           readable, writable,
  'description',    readable, writable,
  'latitude',       readable, writable,
  'longitude',      readable, writable,
  'altitude',       readable, writable,
  'accuracy',       readable, writable,
  'address',        readable, writable,
  'region',         readable, writable,
  'status',         readable, writable,  // 'active', 'inactive', 'pending'
  'acteeId',
  'createdBy',      readable,
  'createdAt',      readable,
  'updatedAt',      readable,
  'deletedAt',      readable,
  embedded('project'),
  embedded('creator')
);

// Extended frame with additional computed data
Site.Extended = class extends Frame.define(
  'submissionsCount', readable,
  'mediaCount',       readable,
  'lastActivity',     readable
) {
  forApi() {
    return {
      submissionsCount: this.submissionsCount || 0,
      mediaCount: this.mediaCount || 0,
      lastActivity: this.lastActivity
    };
  }
};

// Site media frame - for images and videos attached to a site
Site.Media = Frame.define(
  table('site_media'),
  'id',             readable,
  'siteId',         readable,
  'blobId',         readable,
  'name',           readable, writable,
  'type',           readable, writable,  // 'image', 'video'
  'mimeType',       readable,
  'description',    readable, writable,
  'capturedAt',     readable, writable,
  'createdAt',      readable,
  embedded('blob')
);

// Site submission link - connects sites to submissions
Site.Submission = Frame.define(
  table('site_submissions'),
  'siteId',         readable,
  'submissionId',   readable,
  'formId',         readable,
  'linkedAt',       readable
);

module.exports = { Site };
