import https from 'https';

const req = https.request('https://hoda-school.flahtbyshhahmdrda214.workers.dev/', { headers: { 'Cache-Control': 'no-cache' } }, (res) => {
  let b = '';
  res.on('data', (c) => { b += c; });
  res.on('end', () => {
    const m = b.match(/src="\/assets\/(index-[^"]+\.js)"/);
    console.log('Live bundle on Cloudflare:', m ? m[1] : 'NOT FOUND');
    console.log('Latest built bundle:      ', 'index-DeD-nJiT.js');
    console.log('Match:', m && m[1] === 'index-DeD-nJiT.js' ? 'YES - deployed' : 'NO - old version cached');
    
    https.get('https://extendsclass.com/api/json-storage/bin/dbafcce', (res2) => {
      let b2 = '';
      res2.on('data', (c) => { b2 += c; });
      res2.on('end', () => {
        console.log('Cloud META:', b2);
      });
    });
  });
});
req.end();
