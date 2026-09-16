import { processAndSaveFile, removeMediaFile } from '../services/media.service.js';
import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function uploadMedia(request, reply) {
  const data = await request.file();
  if (!data) {
    return errorResponse(reply, 'هیچ فایلی ارسال نشده است', 'BAD_REQUEST', 400);
  }

  const folder = (data.fields?.folder?.value) || 'general';
  const buffer = await data.toBuffer();

  try {
    const media = await processAndSaveFile({
      buffer,
      originalFilename: data.filename,
      folder,
      userId: request.user?.id,
    });

    await createAuditLog({
      userId: request.user?.id,
      action: 'UPLOAD_MEDIA',
      entity: 'Media',
      entityId: media.id,
      newValues: { filename: media.filename, size: media.sizeBytes },
      ipAddress: request.ip
    });

    return successResponse(reply, media, 'فایل با موفقیت بارگذاری شد', 201);
  } catch (err) {
    return errorResponse(reply, err.message || 'خطا در بارگذاری فایل', 'UPLOAD_ERROR', 400);
  }
}

export async function listMedia(request, reply) {
  const { folder, page = 1, limit = 30 } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (folder) where.folder = folder;

  const [items, total] = await Promise.all([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
      include: {
        uploadedBy: {
          select: { id: true, fullName: true, username: true }
        }
      }
    }),
    prisma.media.count({ where })
  ]);

  return successResponse(reply, {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}

export async function deleteMedia(request, reply) {
  const { id } = request.params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return errorResponse(reply, 'فایل مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  await removeMediaFile(media);

  await createAuditLog({
    userId: request.user?.id,
    action: 'DELETE_MEDIA',
    entity: 'Media',
    entityId: id,
    oldValues: { filename: media.filename },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'فایل با موفقیت حذف شد');
}
