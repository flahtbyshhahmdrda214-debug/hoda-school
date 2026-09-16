import { listFacilities, createFacility, updateFacility, deleteFacility } from '../controllers/facility.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function facilityRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', listFacilities);
  fastify.post('/', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, createFacility);
  fastify.put('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, updateFacility);
  fastify.delete('/:id', { preHandler: [authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteFacility);
}
