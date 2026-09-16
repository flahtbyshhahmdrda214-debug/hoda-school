import argon2 from 'argon2';
import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createUserSchema } from '../schemas/auth.schema.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listUsers(request, reply) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      schoolId: true,
      school: {
        select: { id: true, shortName: true, slug: true }
      },
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return successResponse(reply, users);
}

export async function createUser(request, reply) {
  const result = createUserSchema.safeParse(request.body);
  if (!result.success) {
    return errorResponse(reply, result.error.errors[0]?.message || 'اطلاعات نامعتبر است', 'VALIDATION_ERROR', 400);
  }

  const { username, email, password, fullName, role, schoolId } = result.data;

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }]
    }
  });

  if (existing) {
    return errorResponse(reply, 'نام کاربری یا ایمیل تکراری است', 'CONFLICT', 409);
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

  const user = await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      fullName,
      role,
      schoolId: schoolId || null,
      isActive: true,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      schoolId: true,
      isActive: true,
      createdAt: true,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'CREATE_USER',
    entity: 'User',
    entityId: user.id,
    newValues: { username, role },
    ipAddress: request.ip
  });

  return successResponse(reply, user, 'کاربر با موفقیت ایجاد شد', 201);
}

export async function updateUser(request, reply) {
  const { id } = request.params;
  const existing = await prisma.user.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'کاربر یافت نشد', 'NOT_FOUND', 404);
  }

  const { fullName, role, schoolId, isActive, password } = request.body;
  const data = {};

  if (fullName !== undefined) data.fullName = fullName;
  if (role !== undefined) data.role = role;
  if (schoolId !== undefined) data.schoolId = schoolId || null;
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  if (password && password.length >= 8) {
    data.passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      role: true,
      schoolId: true,
      isActive: true,
      updatedAt: true,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_USER',
    entity: 'User',
    entityId: id,
    newValues: { username: existing.username, role: updated.role, isActive: updated.isActive },
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'کاربر با موفقیت به‌روزرسانی شد');
}

export async function deleteUser(request, reply) {
  const { id } = request.params;

  if (id === request.user.id) {
    return errorResponse(reply, 'امکان حذف حساب کاربری جاری وجود ندارد', 'BAD_REQUEST', 400);
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(reply, 'کاربر یافت نشد', 'NOT_FOUND', 404);
  }

  await prisma.user.delete({ where: { id } });

  await createAuditLog({
    userId: request.user.id,
    action: 'DELETE_USER',
    entity: 'User',
    entityId: id,
    oldValues: { username: existing.username },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'کاربر با موفقیت حذف شد');
}

export async function listAuditLogs(request, reply) {
  const { page = 1, limit = 50 } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
      include: {
        user: {
          select: { id: true, username: true, fullName: true, role: true }
        }
      }
    }),
    prisma.auditLog.count()
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
