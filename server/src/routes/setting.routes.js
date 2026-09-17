import { getAllSettings, updateSetting, updateSettingsBatch } from '../controllers/setting.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function settingRoutes(fastify, options) {
  fastify.get('/', getAllSettings);
  fastify.put('/', { preHandler: [authenticate, authorize(['SUPERADMIN'])] }, updateSettingsBatch);
  fastify.put('/:key', { preHandler: [authenticate, authorize(['SUPERADMIN'])] }, updateSetting);
}

