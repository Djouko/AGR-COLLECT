const http = require('http');

function apiCall(method, path, headers = {}, data = null) {
  return new Promise((resolve, reject) => {
    const options = { hostname: 'localhost', port: 8383, path, method, headers: { ...headers } };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    const req = http.request(options, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function setupRoles() {
  console.log('=== CONFIGURATION DES ROLES AGR-COLLECT ===\n');
  
  // 1. Auth admin
  let r = await apiCall('POST', '/v1/sessions', {'Content-Type':'application/json'}, 
    JSON.stringify({email:'admin@agr-collect.local',password:'agrcollect2025'}));
  const token = JSON.parse(r.body).token;
  const auth = {'Authorization':'Bearer '+token, 'Content-Type':'application/json'};
  console.log('1. Authentification admin OK\n');

  // 2. Lister les rôles existants
  console.log('2. Roles existants dans ODK Central:');
  r = await apiCall('GET', '/v1/roles', auth);
  const roles = JSON.parse(r.body);
  roles.forEach(role => {
    console.log(`   - ${role.name} (${role.system}) [ID: ${role.id}]`);
  });
  
  console.log('\n3. Correspondance Cahier des Charges <-> ODK Central:');
  console.log('   ADMINISTRATEUR  -> Administrator (ID: 1)');
  console.log('   AGENT TERRAIN   -> Data Collector (ID: 8)');
  console.log('   SPONSOR         -> Project Viewer (ID: 6)');

  // 3. Créer utilisateur Agent Terrain de test
  console.log('\n4. Creation utilisateur Agent Terrain...');
  r = await apiCall('POST', '/v1/users', auth, 
    JSON.stringify({email:'agent@agr-collect.local', password:'agent2025'}));
  if (r.status === 200) {
    const agent = JSON.parse(r.body);
    console.log('   Agent cree: ID=' + agent.id);
    
    // Assigner rôle Data Collector au projet 1
    r = await apiCall('POST', '/v1/projects/1/assignments/8/' + agent.id, auth);
    console.log('   Role Data Collector assigne: ' + (r.status === 200 ? 'OK' : 'Erreur ' + r.status));
  } else if (r.status === 409) {
    console.log('   Agent existe deja');
  } else {
    console.log('   Erreur creation: ' + r.status + ' ' + r.body);
  }

  // 4. Créer utilisateur Sponsor de test
  console.log('\n5. Creation utilisateur Sponsor...');
  r = await apiCall('POST', '/v1/users', auth, 
    JSON.stringify({email:'sponsor@agr-collect.local', password:'sponsor2025'}));
  if (r.status === 200) {
    const sponsor = JSON.parse(r.body);
    console.log('   Sponsor cree: ID=' + sponsor.id);
    
    // Assigner rôle Project Viewer au projet 1
    r = await apiCall('POST', '/v1/projects/1/assignments/6/' + sponsor.id, auth);
    console.log('   Role Project Viewer assigne: ' + (r.status === 200 ? 'OK' : 'Erreur ' + r.status));
  } else if (r.status === 409) {
    console.log('   Sponsor existe deja');
  } else {
    console.log('   Erreur creation: ' + r.status + ' ' + r.body);
  }

  // 5. Lister tous les utilisateurs
  console.log('\n6. Liste des utilisateurs:');
  r = await apiCall('GET', '/v1/users', auth);
  const users = JSON.parse(r.body);
  users.forEach(user => {
    console.log(`   - ${user.email} (ID: ${user.id})`);
  });

  // 6. Lister les assignations du projet
  console.log('\n7. Assignations du projet AGR Demo:');
  r = await apiCall('GET', '/v1/projects/1/assignments', auth);
  const assignments = JSON.parse(r.body);
  assignments.forEach(a => {
    console.log(`   - User ID ${a.actorId} -> Role ID ${a.roleId}`);
  });

  console.log('\n=== CONFIGURATION TERMINEE ===');
  console.log('\nComptes utilisateurs:');
  console.log('  ADMIN:  admin@agr-collect.local / agrcollect2025');
  console.log('  AGENT:  agent@agr-collect.local / agent2025');
  console.log('  SPONSOR: sponsor@agr-collect.local / sponsor2025');
}

setupRoles().catch(e => console.error('Error:', e));
