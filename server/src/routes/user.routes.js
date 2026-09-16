import { listUsers, createUser, updateUser, deleteUser, listAuditLogs } from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function userRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);
  fastify.addHook('preHandler', authorize(['SUPERADMIN']));

  fastify.get('/', listUsers);
  fastify.post('/', createUser);
  fastify.put('/:id', updateUser);
  fastify.delete('/:id', deleteUser);
  fastify.get('/audit-logs', listAuditLogs);
}
