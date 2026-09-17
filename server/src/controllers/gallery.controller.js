import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listGallery(request, reply) {
  const { schoolSlug, schoolId, category } = request.query;
  const where = {};
  if (category) where.category = category;
  if (schoolId) where.schoolId = schoolId;
  if (schoolSlug) where.school = { slug: schoolSlug };

  const items = await prisma.gallery.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: {
      school: {
        select: { id: true, shortName: true, slug: true, themeColor: true }
      }
    }
  });

  return successResponse(reply, items);
}

export async function createGalleryItem(request, reply) {
  const { title, imageUrl, thumbUrl, schoolId, category, sortOrder } = request.body;

  if (!imageUrl) {
    return errorResponse(reply, 'تصویر گالری الزامی است', 'VALIDATION_ERROR', 400);
  }

  const item = await prisma.gallery.create({
    data: {
      title,
      imageUrl,
      thumbUrl,
      schoolId: schoolId || null,
      category: category || 'general',
      sortOrder: Number(sortOrder) || 0,
    }
  });

  await createAuditLog({
    userId: request.user?.id,
    action: 'CREATE_GALLERY_ITEM',
    entity: 'Gallery',
    entityId: item.id,
    newValues: { title, imageUrl },
    ipAddress: request.ip
  });

  return successResponse(reply, item, 'تصویر با موفقیت به گالری اضافه شد', 201);
}

export async function deleteGalleryItem(request, reply) {
  const { id } = request.params;
  const existing = await prisma.gallery.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'تصویر مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  await prisma.gallery.delete({ where: { id } });

  await createAuditLog({
    userId: request.user?.id,
    action: 'DELETE_GALLERY_ITEM',
    entity: 'Gallery',
    entityId: id,
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'تصویر از گالری حذف شد');
}
