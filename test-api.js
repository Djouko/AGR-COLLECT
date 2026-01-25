const http = require('http');

function apiCall(method, path, headers = {}, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8383,
      path: path,
      method: method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('========================================');
  console.log('   TEST COMPLET API ODK CENTRAL');
  console.log('========================================\n');
  
  const results = [];
  
  // 1. Authentification
  console.log('1. POST /v1/sessions (Authentification)');
  let r = await apiCall('POST', '/v1/sessions', {}, 
    JSON.stringify({ email: 'admin@agr-collect.local', password: 'agrcollect2025' }));
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'Authentification', status: r.status === 200 });
  
  if (r.status !== 200) {
    console.log('   ERREUR: Impossible de continuer sans authentification');
    return;
  }
  
  const session = JSON.parse(r.body);
  const token = session.token;
  console.log('   Token obtenu: ' + token.substring(0, 20) + '...');
  console.log('   Expire: ' + session.expiresAt);
  
  const authHeaders = { 'Authorization': 'Bearer ' + token };
  
  // 2. Utilisateur courant
  console.log('\n2. GET /v1/users/current');
  r = await apiCall('GET', '/v1/users/current', authHeaders);
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'User Current', status: r.status === 200 });
  if (r.status === 200) {
    const user = JSON.parse(r.body);
    console.log('   Email: ' + user.email);
    console.log('   Display: ' + user.displayName);
  }
  
  // 3. Liste utilisateurs
  console.log('\n3. GET /v1/users');
  r = await apiCall('GET', '/v1/users', authHeaders);
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'List Users', status: r.status === 200 });
  if (r.status === 200) {
    const users = JSON.parse(r.body);
    console.log('   Nombre d\'utilisateurs: ' + users.length);
  }
  
  // 4. Liste projets
  console.log('\n4. GET /v1/projects');
  r = await apiCall('GET', '/v1/projects', authHeaders);
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'List Projects', status: r.status === 200 });
  let projects = [];
  if (r.status === 200) {
    projects = JSON.parse(r.body);
    console.log('   Nombre de projets: ' + projects.length);
  }
  
  // 5. Créer un projet
  console.log('\n5. POST /v1/projects (Création projet)');
  r = await apiCall('POST', '/v1/projects', authHeaders, 
    JSON.stringify({ name: 'AGR-Collect Test ' + Date.now() }));
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'Create Project', status: r.status === 200 });
  let projectId = null;
  if (r.status === 200) {
    const project = JSON.parse(r.body);
    projectId = project.id;
    console.log('   Projet créé - ID: ' + projectId);
    console.log('   Nom: ' + project.name);
  }
  
  // 6. Détails projet
  if (projectId) {
    console.log('\n6. GET /v1/projects/' + projectId);
    r = await apiCall('GET', '/v1/projects/' + projectId, authHeaders);
    console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
    results.push({ test: 'Get Project', status: r.status === 200 });
  }
  
  // 7. Liste formulaires du projet
  if (projectId) {
    console.log('\n7. GET /v1/projects/' + projectId + '/forms');
    r = await apiCall('GET', '/v1/projects/' + projectId + '/forms', authHeaders);
    console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
    results.push({ test: 'List Forms', status: r.status === 200 });
    if (r.status === 200) {
      const forms = JSON.parse(r.body);
      console.log('   Nombre de formulaires: ' + forms.length);
    }
  }
  
  // 8. Liste app users du projet
  if (projectId) {
    console.log('\n8. GET /v1/projects/' + projectId + '/app-users');
    r = await apiCall('GET', '/v1/projects/' + projectId + '/app-users', authHeaders);
    console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
    results.push({ test: 'List App Users', status: r.status === 200 });
  }
  
  // 9. Liste rôles
  console.log('\n9. GET /v1/roles');
  r = await apiCall('GET', '/v1/roles', authHeaders);
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'List Roles', status: r.status === 200 });
  if (r.status === 200) {
    const roles = JSON.parse(r.body);
    console.log('   Rôles disponibles: ' + roles.map(r => r.name).join(', '));
  }
  
  // 10. Audits
  console.log('\n10. GET /v1/audits');
  r = await apiCall('GET', '/v1/audits?limit=5', authHeaders);
  console.log('   Status:', r.status, r.status === 200 ? '✓ OK' : '✗ FAIL');
  results.push({ test: 'List Audits', status: r.status === 200 });
  
  // Résumé
  console.log('\n========================================');
  console.log('   RÉSUMÉ DES TESTS');
  console.log('========================================');
  const passed = results.filter(r => r.status).length;
  const total = results.length;
  console.log('   Tests réussis: ' + passed + '/' + total);
  results.forEach(r => {
    console.log('   ' + (r.status ? '✓' : '✗') + ' ' + r.test);
  });
  console.log('\n========================================');
  
  if (passed === total) {
    console.log('   ✓ TOUS LES TESTS API PASSENT');
  } else {
    console.log('   ✗ CERTAINS TESTS ONT ÉCHOUÉ');
  }
  console.log('========================================');
}

runTests().catch(e => console.error('Erreur:', e));
