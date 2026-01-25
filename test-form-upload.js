const http = require('http');
const fs = require('fs');

const formXml = `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:jr="http://openrosa.org/javarosa" xmlns:orx="http://openrosa.org/xforms">
  <h:head>
    <h:title>Collecte Terrain AGR</h:title>
    <model>
      <instance>
        <data id="collecte_terrain_agr" version="1">
          <meta>
            <instanceID/>
          </meta>
          <agent_nom/>
          <date_collecte/>
          <type_activite/>
          <description/>
          <beneficiaires_nombre/>
          <commentaires/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" calculate="concat('uuid:', uuid())"/>
      <bind nodeset="/data/agent_nom" type="string" required="true()"/>
      <bind nodeset="/data/date_collecte" type="date" required="true()"/>
      <bind nodeset="/data/type_activite" type="select1" required="true()"/>
      <bind nodeset="/data/description" type="string" required="true()"/>
      <bind nodeset="/data/beneficiaires_nombre" type="int" required="true()"/>
      <bind nodeset="/data/commentaires" type="string"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/agent_nom">
      <label>Nom de l'agent</label>
    </input>
    <input ref="/data/date_collecte">
      <label>Date de collecte</label>
    </input>
    <select1 ref="/data/type_activite">
      <label>Type d'activité</label>
      <item>
        <label>Agriculture</label>
        <value>agriculture</value>
      </item>
      <item>
        <label>Elevage</label>
        <value>elevage</value>
      </item>
      <item>
        <label>Formation</label>
        <value>formation</value>
      </item>
    </select1>
    <input ref="/data/description">
      <label>Description</label>
    </input>
    <input ref="/data/beneficiaires_nombre">
      <label>Nombre de beneficiaires</label>
    </input>
    <input ref="/data/commentaires">
      <label>Commentaires</label>
    </input>
  </h:body>
</h:html>`;

function apiCall(method, path, headers = {}, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8383,
      path: path,
      method: method,
      headers: { ...headers }
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

async function runTest() {
  console.log('========================================');
  console.log('   TEST UPLOAD FORMULAIRE XFORM');
  console.log('========================================\n');
  
  // 1. Authentification
  console.log('1. Authentification...');
  let r = await apiCall('POST', '/v1/sessions', 
    { 'Content-Type': 'application/json' },
    JSON.stringify({ email: 'admin@agr-collect.local', password: 'agrcollect2025' }));
  
  if (r.status !== 200) {
    console.log('   ERREUR authentification:', r.status);
    return;
  }
  const token = JSON.parse(r.body).token;
  console.log('   ✓ Token obtenu');
  
  const authHeaders = { 'Authorization': 'Bearer ' + token };
  
  // 2. Récupérer le projet existant ou en créer un
  console.log('\n2. Récupération/création projet...');
  r = await apiCall('GET', '/v1/projects', authHeaders);
  let projectId;
  
  if (r.status === 200) {
    const projects = JSON.parse(r.body);
    if (projects.length > 0) {
      projectId = projects[0].id;
      console.log('   ✓ Projet existant trouvé - ID:', projectId);
    } else {
      r = await apiCall('POST', '/v1/projects', 
        { ...authHeaders, 'Content-Type': 'application/json' },
        JSON.stringify({ name: 'AGR-Collect Formulaires' }));
      if (r.status === 200) {
        projectId = JSON.parse(r.body).id;
        console.log('   ✓ Nouveau projet créé - ID:', projectId);
      }
    }
  }
  
  if (!projectId) {
    console.log('   ERREUR: Impossible de récupérer/créer projet');
    return;
  }
  
  // 3. Upload du formulaire XForm
  console.log('\n3. Upload du formulaire XForm...');
  r = await apiCall('POST', '/v1/projects/' + projectId + '/forms?ignoreWarnings=true',
    { ...authHeaders, 'Content-Type': 'application/xml' },
    formXml);
  
  console.log('   Status:', r.status);
  if (r.status === 200) {
    const form = JSON.parse(r.body);
    console.log('   ✓ Formulaire uploadé avec succès!');
    console.log('   Form ID:', form.xmlFormId);
    console.log('   Name:', form.name);
    console.log('   Version:', form.version);
    console.log('   State:', form.state);
    
    // 4. Publier le formulaire
    console.log('\n4. Publication du formulaire...');
    r = await apiCall('POST', '/v1/projects/' + projectId + '/forms/' + encodeURIComponent(form.xmlFormId) + '/draft/publish?version=1',
      authHeaders);
    console.log('   Status:', r.status);
    if (r.status === 200) {
      console.log('   ✓ Formulaire publié!');
    } else {
      console.log('   Info:', r.body);
    }
    
    // 5. Vérifier le formulaire
    console.log('\n5. Vérification du formulaire...');
    r = await apiCall('GET', '/v1/projects/' + projectId + '/forms/' + encodeURIComponent(form.xmlFormId),
      authHeaders);
    if (r.status === 200) {
      const formDetails = JSON.parse(r.body);
      console.log('   ✓ Formulaire vérifié');
      console.log('   State final:', formDetails.state);
      console.log('   Submissions:', formDetails.submissions);
    }
    
  } else {
    console.log('   Réponse:', r.body);
  }
  
  // 6. Lister tous les formulaires
  console.log('\n6. Liste des formulaires du projet...');
  r = await apiCall('GET', '/v1/projects/' + projectId + '/forms', authHeaders);
  if (r.status === 200) {
    const forms = JSON.parse(r.body);
    console.log('   ✓ Nombre de formulaires:', forms.length);
    forms.forEach(f => {
      console.log('   - ' + f.name + ' (' + f.xmlFormId + ') - ' + f.state);
    });
  }
  
  console.log('\n========================================');
  console.log('   TEST TERMINÉ');
  console.log('========================================');
}

runTest().catch(e => console.error('Erreur:', e));
