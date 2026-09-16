import { uploadMedia, listMedia, deleteMedia } from '../controllers/media.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function mediaRoutes(fastify, options) {
  // All media management endpoints require authentication
  fastify.addHook('preHandler', authenticate);

  fastify.post('/upload', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR'])] }, uploadMedia);
  fastify.get('/', listMedia);
  fastify.delete('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteMedia);
}
