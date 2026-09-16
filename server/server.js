import { buildApp } from './src/app.js';
import { config } from './src/config/index.js';

async function start() {
  try {
    const app = await buildApp();
    await app.listen({ port: config.port, host: config.host });
    console.log('Server listening at http://' + config.host + ':' + config.port);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
