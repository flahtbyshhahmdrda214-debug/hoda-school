import { listDocuments, createDocument, updateDocument, deleteDocument } from '../controllers/document.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function documentRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', listDocuments);
  fastify.post('/', { preHandler: [authorize(['SUPERADMIN'])] }, createDocument);
  fastify.put('/:id', { preHandler: [authorize(['SUPERADMIN'])] }, updateDocument);
  fastify.delete('/:id', { preHandler: [authorize(['SUPERADMIN'])] }, deleteDocument);
}
