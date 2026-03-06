// Copyright 2018 ODK Central Developers
// See the NOTICE file at the top-level directory of this distribution and at
// https://github.com/getodk/central-backend/blob/master/NOTICE.
// This file is part of ODK Central. It is subject to the license terms in
// the LICENSE file found in the top-level directory of this distribution and at
// https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
// including this file, may be copied, modified, propagated, or distributed
// except according to the terms contained in the LICENSE file.

const { sql } = require('slonik');
const { FieldKey } = require('../model/frames');
const { getOrNotFound } = require('../util/promise');
const { success } = require('../util/http');
const Problem = require('../util/problem');

module.exports = (service, endpoint) => {

  // Returns the current authenticated field key's display name.
  // No special permission required - returns own identity only.
  service.get('/projects/:projectId/app-users/current', endpoint(({ Projects }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then(() => {
        const actor = auth.actor.orElseGet(() => { throw Problem.user.insufficientRights(); });
        if (actor.type !== 'field_key' && actor.type !== 'public_link')
          throw Problem.user.insufficientRights();
        return { displayName: actor.displayName, type: actor.type, id: actor.id };
      })));

  // Returns submission report stats for the current field key.
  // Counts submissions grouped by form and review state for this agent only.
  service.get('/projects/:projectId/app-users/current/report', endpoint(({ Projects, all }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then(() => {
        const actor = auth.actor.orElseGet(() => { throw Problem.user.insufficientRights(); });
        if (actor.type !== 'field_key' && actor.type !== 'public_link')
          throw Problem.user.insufficientRights();
        const actorId = actor.id;
        const projectId = Number(params.projectId);

        return all(sql`
          SELECT
            f."xmlFormId",
            fd.name AS "formName",
            COUNT(s.id) AS "total",
            COUNT(s.id) FILTER (WHERE s."reviewState" IS NULL) AS "received",
            COUNT(s.id) FILTER (WHERE s."reviewState" = 'approved') AS "approved",
            COUNT(s.id) FILTER (WHERE s."reviewState" = 'hasIssues') AS "hasIssues",
            COUNT(s.id) FILTER (WHERE s."reviewState" = 'rejected') AS "rejected",
            COUNT(s.id) FILTER (WHERE s."reviewState" = 'edited') AS "edited",
            MIN(s."createdAt") AS "firstSubmission",
            MAX(s."createdAt") AS "lastSubmission"
          FROM submissions s
          INNER JOIN forms f ON f.id = s."formId"
          LEFT JOIN form_defs fd ON fd.id = f."currentDefId"
          WHERE s."submitterId" = ${actorId}
            AND f."projectId" = ${projectId}
            AND s."deletedAt" IS NULL
            AND f."deletedAt" IS NULL
          GROUP BY f."xmlFormId", fd.name
          ORDER BY "total" DESC
        `).then((rows) => {
          let totalAll = 0, receivedAll = 0, approvedAll = 0;
          let hasIssuesAll = 0, rejectedAll = 0, editedAll = 0;
          let firstSub = null, lastSub = null;
          const forms = [];

          for (const row of rows) {
            const t = Number(row.total);
            const r = Number(row.received);
            const a = Number(row.approved);
            const h = Number(row.hasIssues);
            const rj = Number(row.rejected);
            const e = Number(row.edited);
            totalAll += t;
            receivedAll += r;
            approvedAll += a;
            hasIssuesAll += h;
            rejectedAll += rj;
            editedAll += e;
            if (row.firstSubmission && (!firstSub || row.firstSubmission < firstSub))
              firstSub = row.firstSubmission;
            if (row.lastSubmission && (!lastSub || row.lastSubmission > lastSub))
              lastSub = row.lastSubmission;
            forms.push({
              xmlFormId: row.xmlFormId,
              formName: row.formName || row.xmlFormId,
              total: t, received: r, approved: a,
              hasIssues: h, rejected: rj, edited: e
            });
          }

          return {
            agentId: actorId,
            agentName: actor.displayName,
            projectId,
            total: totalAll,
            received: receivedAll,
            approved: approvedAll,
            hasIssues: hasIssuesAll,
            rejected: rejectedAll,
            edited: editedAll,
            firstSubmission: firstSub,
            lastSubmission: lastSub,
            forms
          };
        });
      })));

  service.get('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, params, queryOptions }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.list', project))
      .then((project) => FieldKeys.getAllForProject(project, queryOptions))));

  service.post('/projects/:projectId/app-users', endpoint(({ FieldKeys, Projects }, { auth, body, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.create', project))
      .then((project) => {
        const fk = FieldKey.fromApi(body)
          .with({ createdBy: auth.actor.map((actor) => actor.id).orNull() });
        return FieldKeys.create(fk, project);
      })));

  service.delete('/projects/:projectId/app-users/:id', endpoint(({ Actors, FieldKeys, Projects }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.delete', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
      .then(getOrNotFound)
      .then((fk) => Actors.del(fk.actor))
      .then(success)));

  // Update field key display name
  service.patch('/projects/:projectId/app-users/:id', endpoint(({ FieldKeys, Projects, run }, { auth, body, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.create', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
      .then(getOrNotFound)
      .then((fk) => run(sql`UPDATE actors SET "displayName"=${body.displayName}, "updatedAt"=clock_timestamp() WHERE id=${fk.actor.id}`)
        .then(() => fk.with({ displayName: body.displayName })))));

  // Restore access by creating a new session
  service.post('/projects/:projectId/app-users/:id/session', endpoint(({ FieldKeys, Projects, Sessions }, { auth, params }) =>
    Projects.getById(params.projectId)
      .then(getOrNotFound)
      .then((project) => auth.canOrReject('field_key.create', project))
      .then((project) => FieldKeys.getByProjectAndActorId(project.id, params.id))
      .then(getOrNotFound)
      .then((fk) => Sessions.create(fk.actor, new Date('9999-12-31T23:59:59z'))
        .then((session) => fk.withAux('session', session)))));

};
