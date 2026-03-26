import https from 'https';
https.get('https://www.townmanor.ai/api/properties/all', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const list = json.properties || json;
      list.forEach(p => {
        const name = p.name || p.NAME || '';
        if (name.includes('Luxe') || name.includes('Signature')) {
           console.log(`ID: ${p.id || p.ID} | Name: ${name}`);
        }
      });
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
    }
  });
});
