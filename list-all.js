import https from 'https';
https.get('https://www.townmanor.ai/api/ovika/properties', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const list = json.data || json;
      console.log('Total properties:', list.length);
      list.forEach(p => {
        console.log(`ID: ${p.id || p.ID} | Name: ${p.property_name || p.name}`);
      });
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
    }
  });
});
