import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { errorResponse, successResponse } from './utils/response.js';
import authRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildApp() {
  const app = Fastify({
    logger: config.isProd ? true : {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    }
  });

  // 1. Security Headers
  await app.register(helmet, {
    contentSecurityPolicy: false // Handled by Nginx in production
  });

  // 2. CORS with Credentials (Cookies)
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl) or matched origin
      if (!origin || origin === config.corsOrigin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  });

  // 3. Cookie Plugin
  await app.register(cookie, {
    secret: config.cookie.secret,
    hook: 'onRequest',
    parseOptions: {}
  });

  // 4. JWT Plugin
  await app.register(jwt, {
    secret: config.jwt.secret,
    cookie: {
      cookieName: 'hoda_auth_token',
      signed: true
    }
  });

  // 5. Rate Limiting
  await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow
  });

  // 6. Serve Uploads statically
  await app.register(fastifyStatic, {
    root: config.storage.uploadDir,
    prefix: '/uploads/'
  });

  // 7. Core Authentication Routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });

  // 8. Health Check Route

  app.get('/api/health', async (request, reply) => {
    return successResponse(reply, {
      status: 'ok',
      service: 'Hoda School Complex API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // 8. 404 Handler
  app.setNotFoundHandler((request, reply) => {
    return errorResponse(reply, 'مسیر درخواستی یافت نشد', 'NOT_FOUND', 404);
  });

  // 9. Standardized Error Handler (No sensitive backend leaks)
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    
    if (error.validation) {
      return errorResponse(reply, 'اطلاعات ارسالی نامعتبر است', 'VALIDATION_ERROR', 400);
    }

    if (error.statusCode && error.statusCode < 500) {
      return errorResponse(reply, error.message, error.code || 'BAD_REQUEST', error.statusCode);
    }

    return errorResponse(
      reply,
      config.isProd ? 'خطای سرور رخ داده است' : error.message,
      'INTERNAL_SERVER_ERROR',
      500
    );
  });

  return app;
}
