import { listAchievements, createAchievement, updateAchievement, deleteAchievement } from '../controllers/achievement.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function achievementRoutes(fastify, options) {
  fastify.get('/', listAchievements);
  fastify.post('/', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, createAchievement);
  fastify.put('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, updateAchievement);
  fastify.delete('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteAchievement);
}

