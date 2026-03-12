// AGR-Collect - Auto-create admin user on first boot
// This script checks if the admin user exists, and creates + promotes it if not.

const { run } = require('../task/task');
const { createUser, promoteUser } = require('../task/account');

const email = process.env.ADMIN_EMAIL || 'admin@agr-collect.local';
const password = process.env.ADMIN_PASSWORD || 'agrcollect2025';

const initAdmin = async () => {
  // Step 1: Create user (may already exist)
  try {
    await run(createUser(email, password));
    console.log(`Admin user created: ${email}`);
  } catch (err) {
    if (err && (err.problemCode === 409.3 ||
        (err.message && (err.message.includes('unique') || err.message.includes('duplicate') || err.message.includes('already exists') || err.message.includes('uniqueness'))))) {
      console.log(`Admin user already exists: ${email}`);
    } else {
      console.error('Error creating admin user:', err.message || err);
      // Don't return — still try to promote in case user exists but isn't promoted
    }
  }

  // Step 2: Always attempt promotion (idempotent)
  try {
    await run(promoteUser(email));
    console.log(`Admin user promoted to admin role: ${email}`);
  } catch (err) {
    if (err && (err.problemCode === 409.3 ||
        (err.message && (err.message.includes('already') || err.message.includes('duplicate'))))) {
      console.log(`Admin user already has admin role: ${email}`);
    } else {
      console.error('Error promoting admin user:', err.message || err);
    }
  }
};

initAdmin();
