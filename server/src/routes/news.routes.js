import { listNews, getNewsById, createNews, updateNews, deleteNews } from '../controllers/news.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function newsRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', listNews);
  fastify.get('/:id', getNewsById);
  fastify.post('/', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR'])] }, createNews);
  fastify.put('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR'])] }, updateNews);
  fastify.delete('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteNews);
}
