const BINS = {
  meta: 'dbafcce',
  schools: 'accffec',
  news: 'bcfcecd',
  achievements: 'bbdbcce',
  documents: 'baacafc',
  members: 'dbcaeac',
  settings: 'fdbdeee',
  teachers: 'cdfbebd',
  facilities: 'ccbcece'
};

const EXTENDS_BASE = 'https://extendsclass.com/api/json-storage/bin';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight for all /api/ routes
    if (request.method === 'OPTIONS' && url.pathname.startsWith('/api/')) {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ status: 'ok', worker: true, time: new Date().toISOString() }), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Cloud Sync API - GET
    if (url.pathname === '/api/sync/get') {
      const binName = url.searchParams.get('bin') || 'meta';
      const binId = BINS[binName];
      if (!binId) {
        return new Response(JSON.stringify({ error: 'Invalid bin name: ' + binName }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const upstream = await fetch(`${EXTENDS_BASE}/${binId}?_t=${Date.now()}`, {
          headers: { 'Accept': 'application/json' }
        });
        const data = await upstream.text();
        return new Response(data, {
          status: upstream.status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // Cloud Sync API - PUT or POST
    if (url.pathname === '/api/sync/put') {
      const binName = url.searchParams.get('bin') || 'meta';
      const binId = BINS[binName];
      if (!binId) {
        return new Response(JSON.stringify({ error: 'Invalid bin name: ' + binName }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      try {
        const bodyText = await request.text();
        const upstream = await fetch(`${EXTENDS_BASE}/${binId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: bodyText
        });
        const data = await upstream.text();
        return new Response(data, {
          status: upstream.status,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // All static assets and SPA routes
    return env.ASSETS.fetch(request);
  }
};
