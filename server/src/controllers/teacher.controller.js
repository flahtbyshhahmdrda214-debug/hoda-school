import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listTeachers(request, reply) {
  const { schoolId } = request.query;
  const where = {};

  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId) {
    where.schoolId = request.user.schoolId;
  } else if (schoolId) {
    where.schoolId = schoolId;
  }

  const teachers = await prisma.teacher.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      school: {
        select: { id: true, shortName: true, slug: true }
      }
    }
  });

  return successResponse(reply, teachers);
}

export async function createTeacher(request, reply) {
  const { firstName, lastName, roleTitle, degree, experience, highlight, avatarUrl, sortOrder, isPublished } = request.body;
  let { schoolId } = request.body;

  if (request.user.role === 'SCHOOL_ADMIN') {
    schoolId = request.user.schoolId;
  }

  if (!schoolId || !firstName || !lastName || !roleTitle) {
    return errorResponse(reply, 'مشخصات معلم، نام، نام خانوادگی و شناسه مدرسه الزامی است', 'VALIDATION_ERROR', 400);
  }

  const teacher = await prisma.teacher.create({
    data: {
      schoolId,
      firstName,
      lastName,
      roleTitle,
      degree,
      experience,
      highlight,
      avatarUrl,
      sortOrder: Number(sortOrder) || 0,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'CREATE_TEACHER',
    entity: 'Teacher',
    entityId: teacher.id,
    newValues: { name: `${firstName} ${lastName}` },
    ipAddress: request.ip
  });

  return successResponse(reply, teacher, 'معلم با موفقیت ثبت شد', 201);
}

export async function updateTeacher(request, reply) {
  const { id } = request.params;
  const existing = await prisma.teacher.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'معلم یافت نشد', 'NOT_FOUND', 404);
  }

  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId !== existing.schoolId) {
    return errorResponse(reply, 'شما مجاز به ویرایش این معلم نیستید', 'FORBIDDEN', 403);
  }

  const updated = await prisma.teacher.update({
    where: { id },
    data: request.body
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_TEACHER',
    entity: 'Teacher',
    entityId: id,
    newValues: request.body,
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'اطلاعات معلم با موفقیت به‌روزرسانی شد');
}

export async function deleteTeacher(request, reply) {
  const { id } = request.params;
  const existing = await prisma.teacher.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'معلم یافت نشد', 'NOT_FOUND', 404);
  }

  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId !== existing.schoolId) {
    return errorResponse(reply, 'شما مجاز به حذف این معلم نیستید', 'FORBIDDEN', 403);
  }

  await prisma.teacher.delete({ where: { id } });

  await createAuditLog({
    userId: request.user.id,
    action: 'DELETE_TEACHER',
    entity: 'Teacher',
    entityId: id,
    oldValues: { name: `${existing.firstName} ${existing.lastName}` },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'معلم با موفقیت حذف شد');
}
