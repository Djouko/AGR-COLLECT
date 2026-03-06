// AGR-Collect - Auto-create admin user on first boot
// This script checks if the admin user exists, and creates + promotes it if not.

const { run } = require('../task/task');
const { createUser, promoteUser } = require('../task/account');

const email = process.env.ADMIN_EMAIL || 'admin@agr-collect.local';
const password = process.env.ADMIN_PASSWORD || 'agrcollect2025';

const initAdmin = async () => {
  try {
    await run(createUser(email, password));
    console.log(`Admin user created: ${email}`);
    await run(promoteUser(email));
    console.log(`Admin user promoted: ${email}`);
  } catch (err) {
    if (err && err.message && (err.message.includes('unique') || err.message.includes('duplicate') || err.message.includes('already exists') || err.message.includes('uniqueness'))) {
      console.log(`Admin user already exists: ${email} — skipping creation.`);
    } else if (err && err.problemCode === 409.3) {
      console.log(`Admin user already exists: ${email} — skipping creation.`);
    } else {
      console.error('Error creating admin user:', err.message || err);
    }
  }
};

initAdmin();
