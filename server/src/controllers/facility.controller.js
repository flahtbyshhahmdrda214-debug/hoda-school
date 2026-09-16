import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listFacilities(request, reply) {
  const { schoolId } = request.query;
  const where = {};

  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId) {
    where.schoolId = request.user.schoolId;
  } else if (schoolId) {
    where.schoolId = schoolId;
  }

  const facilities = await prisma.facility.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      school: { select: { id: true, shortName: true, slug: true } }
    }
  });

  return successResponse(reply, facilities);
}

export async function createFacility(request, reply) {
  const { title, description, iconName, imageUrl, sortOrder, isPublished } = request.body;
  let { schoolId } = request.body;

  if (request.user.role === 'SCHOOL_ADMIN') {
    schoolId = request.user.schoolId;
  }

  if (!schoolId || !title) {
    return errorResponse(reply, 'عنوان امکانات و شناسه مدرسه الزامی است', 'VALIDATION_ERROR', 400);
  }

  const facility = await prisma.facility.create({
    data: {
      schoolId,
      title,
      description,
      iconName,
      imageUrl,
      sortOrder: Number(sortOrder) || 0,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'CREATE_FACILITY',
    entity: 'Facility',
    entityId: facility.id,
    newValues: { title },
    ipAddress: request.ip
  });

  return successResponse(reply, facility, 'امکان با موفقیت اضافه شد', 201);
}

export async function updateFacility(request, reply) {
  const { id } = request.params;
  const existing = await prisma.facility.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'مورد مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId !== existing.schoolId) {
    return errorResponse(reply, 'شما مجاز به ویرایش این امکان نیستید', 'FORBIDDEN', 403);
  }

  const updated = await prisma.facility.update({
    where: { id },
    data: request.body
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_FACILITY',
    entity: 'Facility',
    entityId: id,
    newValues: request.body,
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'امکان با موفقیت به‌روزرسانی شد');
}

export async function deleteFacility(request, reply) {
  const { id } = request.params;
  const existing = await prisma.facility.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'مورد مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId !== existing.schoolId) {
    return errorResponse(reply, 'شما مجاز به حذف این امکان نیستید', 'FORBIDDEN', 403);
  }

  await prisma.facility.delete({ where: { id } });

  await createAuditLog({
    userId: request.user.id,
    action: 'DELETE_FACILITY',
    entity: 'Facility',
    entityId: id,
    oldValues: { title: existing.title },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'امکان با موفقیت حذف شد');
}
