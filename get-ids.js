import https from 'https';
https.get('https://www.townmanor.ai/api/ovika/properties', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const list = json.data || json;
      if (Array.isArray(list)) {
        list.forEach(p => {
          const name = p.property_name || p.name || '';
          if (name.includes('Luxe') || name.includes('Signature')) {
            console.log('ID:', p.id || p.ID, 'Name:', name);
          }
        });
      } else {
        console.log('Not an array');
      }
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
    }
  });
});
