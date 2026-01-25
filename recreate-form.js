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

async function recreateForm() {
  console.log('=== RECREATION FORMULAIRE AVEC ENKETO ===');
  
  // 1. Auth
  let r = await apiCall('POST', '/v1/sessions', {'Content-Type':'application/json'}, 
    JSON.stringify({email:'admin@agr-collect.local',password:'agrcollect2025'}));
  const token = JSON.parse(r.body).token;
  const auth = {'Authorization':'Bearer '+token, 'Content-Type':'application/json'};
  console.log('1. Auth OK');

  // 2. Supprimer l'ancien formulaire
  console.log('2. Suppression ancien formulaire...');
  r = await apiCall('DELETE', '/v1/projects/1/forms/collecte_terrain_agr', auth);
  console.log('   Status:', r.status);
  
  r = await apiCall('DELETE', '/v1/projects/1/forms/agr_collecte_v2', auth);
  console.log('   Cleanup v2:', r.status);

  // 3. Attendre un peu
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 4. Créer nouveau formulaire
  console.log('3. Creation nouveau formulaire...');
  const formXml = `<?xml version="1.0"?>
<h:html xmlns="http://www.w3.org/2002/xforms" xmlns:h="http://www.w3.org/1999/xhtml" xmlns:jr="http://openrosa.org/javarosa">
  <h:head>
    <h:title>AGR Collecte Terrain</h:title>
    <model>
      <instance>
        <data id="agr_collecte" version="1">
          <meta><instanceID/></meta>
          <agent_nom/>
          <date_collecte/>
          <activite/>
          <description/>
          <beneficiaires/>
        </data>
      </instance>
      <bind nodeset="/data/meta/instanceID" type="string" readonly="true()" jr:preload="uid"/>
      <bind nodeset="/data/agent_nom" type="string" required="true()"/>
      <bind nodeset="/data/date_collecte" type="date" required="true()"/>
      <bind nodeset="/data/activite" type="select1" required="true()"/>
      <bind nodeset="/data/description" type="string"/>
      <bind nodeset="/data/beneficiaires" type="int"/>
    </model>
  </h:head>
  <h:body>
    <input ref="/data/agent_nom"><label>Nom Agent</label></input>
    <input ref="/data/date_collecte"><label>Date</label></input>
    <select1 ref="/data/activite"><label>Activite</label>
      <item><label>Agriculture</label><value>agri</value></item>
      <item><label>Elevage</label><value>elev</value></item>
      <item><label>Formation</label><value>form</value></item>
    </select1>
    <input ref="/data/description"><label>Description</label></input>
    <input ref="/data/beneficiaires"><label>Beneficiaires</label></input>
  </h:body>
</h:html>`;

  r = await apiCall('POST', '/v1/projects/1/forms?ignoreWarnings=true', 
    {...auth, 'Content-Type':'application/xml'}, formXml);
  console.log('   Status:', r.status);
  
  if (r.status === 200) {
    const form = JSON.parse(r.body);
    console.log('   Form created:', form.xmlFormId);
    console.log('   State:', form.state);
    
    // 5. Publier le formulaire (déclenche le worker Enketo)
    console.log('4. Publication du formulaire...');
    r = await apiCall('POST', '/v1/projects/1/forms/' + encodeURIComponent(form.xmlFormId) + '/draft/publish?version=1', auth);
    console.log('   Publish status:', r.status);
    
    // 6. Attendre le worker Enketo
    console.log('5. Attente generation enketoId (8s)...');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // 7. Vérifier l'enketoId
    r = await apiCall('GET', '/v1/projects/1/forms/' + encodeURIComponent(form.xmlFormId), auth);
    if (r.status === 200) {
      const updatedForm = JSON.parse(r.body);
      console.log('6. Verification finale:');
      console.log('   enketoId:', updatedForm.enketoId);
      console.log('   enketoOnceId:', updatedForm.enketoOnceId);
      if (updatedForm.enketoId) {
        console.log('\n=== SUCCES! EnketoId genere ===');
        console.log('URL Preview: https://localhost/projects/1/forms/' + form.xmlFormId + '/submissions/new');
      } else {
        console.log('\n=== ATTENTION: EnketoId toujours null ===');
        console.log('Verifier les logs du service...');
      }
    }
  } else {
    console.log('   Error:', r.body);
  }
}

recreateForm().catch(e => console.error('Error:', e));
