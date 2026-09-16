import { getAllSettings, updateSetting } from '../controllers/setting.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function settingRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.get('/', getAllSettings);
  fastify.put('/:key', { preHandler: [authorize(['SUPERADMIN'])] }, updateSetting);
}
