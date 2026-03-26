const https = require('https');
https.get('https://www.townmanor.ai/api/ovika/properties', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const list = json.data || json;
    const l3 = list.find(p => p.property_name && p.property_name.includes('Luxe'));
    console.log(JSON.stringify(l3, null, 2));
  });
});
