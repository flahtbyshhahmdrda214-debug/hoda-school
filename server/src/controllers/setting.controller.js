import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function getAllSettings(request, reply) {
  const settings = await prisma.siteSetting.findMany();
  const formatted = {};
  for (const s of settings) {
    try {
      formatted[s.key] = JSON.parse(s.value);
    } catch {
      formatted[s.key] = s.value;
    }
  }
  return successResponse(reply, formatted);
}

export async function updateSetting(request, reply) {
  const { key } = request.params;
  const { value } = request.body;

  if (!value) {
    return errorResponse(reply, 'مقدار تنظیمات الزامی است', 'VALIDATION_ERROR', 400);
  }

  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

  const updated = await prisma.siteSetting.upsert({
    where: { key },
    update: { value: stringValue },
    create: { key, value: stringValue },
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_SETTING',
    entity: 'SiteSetting',
    entityId: key,
    newValues: { key, value: stringValue },
    ipAddress: request.ip
  });

  return successResponse(reply, { key: updated.key, value: JSON.parse(updated.value) }, 'تنظیمات با موفقیت ذخیره شد');
}
