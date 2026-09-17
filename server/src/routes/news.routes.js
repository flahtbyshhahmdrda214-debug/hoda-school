import { listNews, getNewsById, createNews, updateNews, deleteNews } from '../controllers/news.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function newsRoutes(fastify, options) {
  fastify.get('/', listNews);
  fastify.get('/:id', getNewsById);
  fastify.post('/', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR'])] }, createNews);
  fastify.put('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR'])] }, updateNews);
  fastify.delete('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteNews);
}

