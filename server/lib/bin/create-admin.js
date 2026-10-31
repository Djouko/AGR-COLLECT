// AGR-Collect - Auto-create admin user on first boot
// Idempotent: an existing account is left untouched (its password is never
// reset) and is only promoted if it is not already a global administrator.

const { sql } = require('slonik');
const { task } = require('../task/task');
const { User } = require('../model/frames');

const email = process.env.ADMIN_EMAIL || 'admin@agr-collect.local';
const password = process.env.ADMIN_PASSWORD || 'agrcollect2025';

const ensureAdmin = task.withContainer((container) => () => container.transacting(async ({ Assignments, Users, maybeOne }) => {
  let user = (await Users.getByEmail(email)).orNull();
  if (user == null) {
    user = await Users.create(User.fromApi({ email }).forV1OnlyCopyEmailToDisplayName());
    await Users.updatePassword(user, password);
    console.log(`Admin user created: ${email}`);
  } else {
    console.log(`Admin user already exists: ${email}`);
  }

  const isAdmin = await maybeOne(sql`
    select 1 from assignments
      join roles on roles.id = assignments."roleId"
    where assignments."actorId" = ${user.actorId} and assignments."acteeId" = '*' and roles.system = 'admin'`);
  if (isAdmin.isDefined()) {
    console.log(`Admin user already has admin role: ${email}`);
  } else {
    await Assignments.grantSystem(user.actor, 'admin', '*');
    console.log(`Admin user promoted to admin role: ${email}`);
  }
}));

// Without this top-level await, Node can exit before ensureAdmin() completes,
// and PM2/supervisord has no visibility into whether the create succeeded,
// which made productions boots appear to "forget" to seed the admin user.
ensureAdmin()
  .then(() => {
    console.log('create-admin finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('create-admin failed:', err && err.stack ? err.stack : err);
    // Always exit success: even on failure we want the service to start so
    // the admin can later be created manually via odk-cmd user-promote.
    process.exit(0);
  });
