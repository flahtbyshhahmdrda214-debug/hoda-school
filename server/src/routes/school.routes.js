import { listSchools, getSchoolById, updateSchool } from '../controllers/school.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function schoolRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', listSchools);
  fastify.get('/:id', getSchoolById);
  fastify.put('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, updateSchool);
}
