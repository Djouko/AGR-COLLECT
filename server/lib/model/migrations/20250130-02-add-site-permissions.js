// Copyright 2025 AGR-Collect Developers
// Migration to add site permissions to existing roles

const siteVerbsAll = ['site.create', 'site.read', 'site.update', 'site.delete', 'site.list'];
const siteVerbsRead = ['site.read', 'site.list'];

const without = (list, arr) => arr.filter((x) => !list.includes(x));

const up = async (db) => {
  // Admin gets all site permissions
  const [adminRole] = await db.select('id', 'verbs').from('roles').where({ system: 'admin' });
  if (adminRole) {
    const newVerbs = adminRole.verbs.concat(siteVerbsAll.filter(v => !adminRole.verbs.includes(v)));
    await db.update({ verbs: JSON.stringify(newVerbs) }).into('roles').where({ system: 'admin' });
  }

  // Manager gets all site permissions
  const [managerRole] = await db.select('id', 'verbs').from('roles').where({ system: 'manager' });
  if (managerRole) {
    const newVerbs = managerRole.verbs.concat(siteVerbsAll.filter(v => !managerRole.verbs.includes(v)));
    await db.update({ verbs: JSON.stringify(newVerbs) }).into('roles').where({ system: 'manager' });
  }

  // Viewer gets read-only site permissions
  const [viewerRole] = await db.select('id', 'verbs').from('roles').where({ system: 'viewer' });
  if (viewerRole) {
    const newVerbs = viewerRole.verbs.concat(siteVerbsRead.filter(v => !viewerRole.verbs.includes(v)));
    await db.update({ verbs: JSON.stringify(newVerbs) }).into('roles').where({ system: 'viewer' });
  }

  // Data Collector gets read-only site permissions
  const [formfillRole] = await db.select('id', 'verbs').from('roles').where({ system: 'formfill' });
  if (formfillRole) {
    const newVerbs = formfillRole.verbs.concat(siteVerbsRead.filter(v => !formfillRole.verbs.includes(v)));
    await db.update({ verbs: JSON.stringify(newVerbs) }).into('roles').where({ system: 'formfill' });
  }

  // Create assignments on 'site' actee for users with global admin role
  // Get all actors with admin role on '*' (global)
  if (adminRole) {
    const globalAdmins = await db.select('actorId').from('assignments')
      .where({ roleId: adminRole.id, acteeId: '*' });
    
    for (const admin of globalAdmins) {
      // Check if assignment already exists
      const existing = await db.select('actorId').from('assignments')
        .where({ actorId: admin.actorId, roleId: adminRole.id, acteeId: 'site' });
      
      if (existing.length === 0) {
        await db.insert({ actorId: admin.actorId, roleId: adminRole.id, acteeId: 'site' }).into('assignments');
      }
    }
  }
};

const down = async (db) => {
  // Remove site assignments
  const [adminRole] = await db.select('id').from('roles').where({ system: 'admin' });
  if (adminRole) {
    await db.delete().from('assignments').where({ roleId: adminRole.id, acteeId: 'site' });
  }

  // Remove site verbs from roles
  for (const system of ['admin', 'manager', 'viewer', 'formfill']) {
    const [role] = await db.select('verbs').from('roles').where({ system });
    if (role) {
      const newVerbs = without(siteVerbsAll, role.verbs);
      await db.update({ verbs: JSON.stringify(newVerbs) }).into('roles').where({ system });
    }
  }
};

module.exports = { up, down };
