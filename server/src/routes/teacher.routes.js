import { listTeachers, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacher.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function teacherRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', listTeachers);
  fastify.post('/', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, createTeacher);
  fastify.put('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, updateTeacher);
  fastify.delete('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteTeacher);
}
