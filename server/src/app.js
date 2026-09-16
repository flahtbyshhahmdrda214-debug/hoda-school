import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import multipart from '@fastify/multipart';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { errorResponse, successResponse } from './utils/response.js';

// Route Handlers
import authRoutes from './routes/auth.routes.js';
import mediaRoutes from './routes/media.routes.js';
import schoolRoutes from './routes/school.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import achievementRoutes from './routes/achievement.routes.js';
import newsRoutes from './routes/news.routes.js';
import documentRoutes from './routes/document.routes.js';
import settingRoutes from './routes/setting.routes.js';
import userRoutes from './routes/user.routes.js';
import publicRoutes from './routes/public.routes.js';

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
      // Allow requests with no origin or matched origins
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

  // 6. Multipart Form & File Upload
  await app.register(multipart, {
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB limit
    }
  });

  // 7. Serve Uploads statically
  await app.register(fastifyStatic, {
    root: config.storage.uploadDir,
    prefix: '/uploads/'
  });

  // 8. Register API v1 Routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(mediaRoutes, { prefix: '/api/v1/media' });
  await app.register(schoolRoutes, { prefix: '/api/v1/schools' });
  await app.register(teacherRoutes, { prefix: '/api/v1/teachers' });
  await app.register(facilityRoutes, { prefix: '/api/v1/facilities' });
  await app.register(achievementRoutes, { prefix: '/api/v1/achievements' });
  await app.register(newsRoutes, { prefix: '/api/v1/news' });
  await app.register(documentRoutes, { prefix: '/api/v1/documents' });
  await app.register(settingRoutes, { prefix: '/api/v1/settings' });
  await app.register(userRoutes, { prefix: '/api/v1/users' });
  await app.register(publicRoutes, { prefix: '/api/v1/public' });

  // 9. Health Check Route
  app.get('/api/health', async (request, reply) => {
    return successResponse(reply, {
      status: 'ok',
      service: 'Hoda School Complex API',
      version: '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // 10. 404 Handler
  app.setNotFoundHandler((request, reply) => {
    return errorResponse(reply, 'مسیر درخواستی یافت نشد', 'NOT_FOUND', 404);
  });

  // 11. Standardized Error Handler
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
