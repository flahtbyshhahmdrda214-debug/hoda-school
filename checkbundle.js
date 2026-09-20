const https = require('https');
https.get('https://hoda-school.flahtbyshhahmdrda214.workers.dev/', function(res) {
  var b = '';
  res.on('data', function(c) { b += c; });
  res.on('end', function() {
    var m = b.match(/src="(\/assets\/index-[^"]+\.js)"/);
    console.log('Live bundle:', m ? m[1] : 'NOT FOUND');
    
    // Also check meta
    https.get('https://extendsclass.com/api/json-storage/bin/dbafcce?_t=' + Date.now(), function(res2) {
      var b2 = '';
      res2.on('data', function(c) { b2 += c; });
      res2.on('end', function() { console.log('Cloud Meta:', b2); });
    });
  });
});
