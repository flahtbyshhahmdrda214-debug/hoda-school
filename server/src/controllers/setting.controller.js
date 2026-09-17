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

  let parsedVal = updated.value;
  try { parsedVal = JSON.parse(updated.value); } catch {}

  return successResponse(reply, { key: updated.key, value: parsedVal }, 'تنظیمات با موفقیت ذخیره شد');
}

export async function updateSettingsBatch(request, reply) {
  const updates = request.body;
  if (!updates || typeof updates !== 'object') {
    return errorResponse(reply, 'اطلاعات نامعتبر است', 'VALIDATION_ERROR', 400);
  }

  for (const [key, value] of Object.entries(updates)) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue }
    });
  }

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_SETTINGS_BATCH',
    entity: 'SiteSetting',
    entityId: 'all',
    newValues: updates,
    ipAddress: request.ip
  });

  return successResponse(reply, updates, 'تنظیمات با موفقیت ذخیره شدند');
}
