import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listAchievements(request, reply) {
  const { schoolId } = request.query;
  const where = {};
  if (schoolId) where.schoolId = schoolId;

  const achievements = await prisma.achievement.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      school: { select: { id: true, shortName: true, slug: true } }
    }
  });

  return successResponse(reply, achievements);
}

export async function createAchievement(request, reply) {
  const { year, title, recipient, description, category, imageUrl, sortOrder, isPublished } = request.body;
  let { schoolId } = request.body;

  if (request.user.role === 'SCHOOL_ADMIN') {
    schoolId = request.user.schoolId;
  }

  if (!year || !title || !category) {
    return errorResponse(reply, 'سال، عنوان افتخار و دسته‌بندی الزامی است', 'VALIDATION_ERROR', 400);
  }

  const achievement = await prisma.achievement.create({
    data: {
      schoolId: schoolId || null,
      year,
      title,
      recipient,
      description,
      category,
      imageUrl,
      sortOrder: Number(sortOrder) || 0,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'CREATE_ACHIEVEMENT',
    entity: 'Achievement',
    entityId: achievement.id,
    newValues: { title },
    ipAddress: request.ip
  });

  return successResponse(reply, achievement, 'افتخار با موفقیت ثبت شد', 201);
}

export async function updateAchievement(request, reply) {
  const { id } = request.params;
  const existing = await prisma.achievement.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'افتخار یافت نشد', 'NOT_FOUND', 404);
  }

  const updated = await prisma.achievement.update({
    where: { id },
    data: request.body
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_ACHIEVEMENT',
    entity: 'Achievement',
    entityId: id,
    newValues: request.body,
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'افتخار با موفقیت به‌روزرسانی شد');
}

export async function deleteAchievement(request, reply) {
  const { id } = request.params;
  const existing = await prisma.achievement.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'افتخار یافت نشد', 'NOT_FOUND', 404);
  }

  await prisma.achievement.delete({ where: { id } });

  await createAuditLog({
    userId: request.user.id,
    action: 'DELETE_ACHIEVEMENT',
    entity: 'Achievement',
    entityId: id,
    oldValues: { title: existing.title },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'افتخار با موفقیت حذف شد');
}
