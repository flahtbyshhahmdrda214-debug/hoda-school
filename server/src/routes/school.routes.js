import { listSchools, getSchoolById, updateSchool } from '../controllers/school.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function schoolRoutes(fastify, options) {
  fastify.get('/', listSchools);
  fastify.get('/:id', getSchoolById);
  fastify.put('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, updateSchool);
}

