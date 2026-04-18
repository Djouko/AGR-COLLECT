// AGR-Collect fork — deliberate divergence from upstream ODK Central.
//
// Rationale:
//   In upstream Central, the `app-user` role is restricted to
//   ['form.read', 'submission.create']. App-users can push submissions but
//   cannot read any back. This prevents field agents from learning the review
//   state of their own work from the mobile client.
//
//   AGR-Collect ships a mobile feature (submission review notifications) that
//   requires the Android client — authenticated with a field-key URL token —
//   to poll the OData submissions feed for status changes. Two endpoints are
//   consulted:
//     - GET /v1/projects/:id/forms/:xml.svc/Submissions  (submission.list)
//     - GET /v1/projects/:id/forms/:xml/submissions/:iid (submission.read)
//
//   This migration grants those two verbs to the app-user role so the mobile
//   poller can operate with the same token already provisioned on the device
//   (QR code onboarding, no email/password required).
//
// Security trade-off:
//   App-users scoped to a project will now be able to list and read ALL
//   submissions of forms they have access to on that project — not only their
//   own. For SAAHDEL's deployment (trusted intra-project field teams) this is
//   acceptable. Do NOT merge this migration back upstream without explicit
//   review; it changes the baseline security posture of the app-user role.

const up = (db) => db.raw(`
  update roles
     set verbs = (
       select jsonb_agg(distinct v)
         from jsonb_array_elements_text(verbs || '["submission.list","submission.read"]'::jsonb) as v
     )
   where system = 'app-user';
`);

const down = (db) => db.raw(`
  update roles
     set verbs = (
       select coalesce(jsonb_agg(v), '[]'::jsonb)
         from jsonb_array_elements_text(verbs) as v
        where v not in ('submission.list', 'submission.read')
     )
   where system = 'app-user';
`);

module.exports = { up, down };
