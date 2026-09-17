import http from 'http';

function testReq(path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(===   -> Status  ===);
        console.log('Body:', data);
        resolve();
      });
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  await testReq('/api/v1/public/news');
  await testReq('/api/v1/public/achievements');
  await testReq('/api/v1/public/gallery');
  await testReq('/api/v1/auth/login', 'POST', { username: 'superadmin', password: 'Admin@Hoda2026!' });
}

run();
