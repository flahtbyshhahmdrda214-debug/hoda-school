import { login, logout, getMe, changePassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

export default async function authRoutes(fastify, options) {
  fastify.post('/login', login);
  fastify.post('/logout', { preHandler: [authenticate] }, logout);
  fastify.get('/me', { preHandler: [authenticate] }, getMe);
  fastify.post('/change-password', { preHandler: [authenticate] }, changePassword);
}
