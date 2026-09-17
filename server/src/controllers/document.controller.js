import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listDocuments(request, reply) {
  const docs = await prisma.document.findMany({
    orderBy: { sortOrder: 'asc' }
  });
  return successResponse(reply, docs);
}

export async function createDocument(request, reply) {
  const { title, description, previewImageUrl, fileUrl, documentNumber, issueDate, iconName, sortOrder, isPublished } = request.body;
  const issuer = request.body.issuer || 'مجتمع آموزشی قرآنی هدی';

  if (!title || !fileUrl) {
    return errorResponse(reply, 'عنوان و فایل سند الزامی هستند', 'VALIDATION_ERROR', 400);
  }

  const doc = await prisma.document.create({
    data: {
      title,
      description,
      previewImageUrl,
      fileUrl,
      issuer,
      documentNumber,
      issueDate,
      iconName: iconName || 'ShieldCheck',
      sortOrder: Number(sortOrder) || 0,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'CREATE_DOCUMENT',
    entity: 'Document',
    entityId: doc.id,
    newValues: { title },
    ipAddress: request.ip
  });

  return successResponse(reply, doc, 'سند با موفقیت ایجاد شد', 201);
}

export async function updateDocument(request, reply) {
  const { id } = request.params;
  const existing = await prisma.document.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'سند یافت نشد', 'NOT_FOUND', 404);
  }

  const updated = await prisma.document.update({
    where: { id },
    data: request.body
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_DOCUMENT',
    entity: 'Document',
    entityId: id,
    newValues: request.body,
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'سند با موفقیت به‌روزرسانی شد');
}

export async function deleteDocument(request, reply) {
  const { id } = request.params;
  const existing = await prisma.document.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'سند یافت نشد', 'NOT_FOUND', 404);
  }

  await prisma.document.delete({ where: { id } });

  await createAuditLog({
    userId: request.user.id,
    action: 'DELETE_DOCUMENT',
    entity: 'Document',
    entityId: id,
    oldValues: { title: existing.title },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'سند با موفقیت حذف شد');
}
