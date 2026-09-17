import { listDocuments, createDocument, updateDocument, deleteDocument } from '../controllers/document.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function documentRoutes(fastify, options) {
  fastify.get('/', listDocuments);
  fastify.post('/', { preHandler: [authenticate, authorize(['SUPERADMIN'])] }, createDocument);
  fastify.put('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN'])] }, updateDocument);
  fastify.delete('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN'])] }, deleteDocument);
}

