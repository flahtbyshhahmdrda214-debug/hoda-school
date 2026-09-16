import argon2 from 'argon2';
import prisma from '../services/prisma.js';
import { config } from '../config/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { loginSchema, changePasswordSchema } from '../schemas/auth.schema.js';
import { createAuditLog } from '../middleware/auth.js';

export async function login(request, reply) {
  const result = loginSchema.safeParse(request.body);
  if (!result.success) {
    return errorResponse(reply, result.error.errors[0]?.message || 'اطلاعات نامعتبر است', 'VALIDATION_ERROR', 400);
  }

  const { identifier, password } = result.data;

  // Lookup by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier }
      ]
    },
    include: {
      school: {
        select: {
          id: true,
          slug: true,
          shortName: true,
          fullName: true,
        }
      }
    }
  });

  if (!user || !user.isActive) {
    return errorResponse(reply, 'نام کاربری یا کلمه عبور نادرست است', 'INVALID_CREDENTIALS', 401);
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, password);
  if (!isPasswordValid) {
    return errorResponse(reply, 'نام کاربری یا کلمه عبور نادرست است', 'INVALID_CREDENTIALS', 401);
  }

  // Generate JWT token
  const token = request.server.jwt.sign({
    id: user.id,
    username: user.username,
    role: user.role,
    schoolId: user.schoolId
  }, {
    expiresIn: config.jwt.expiresIn
  });

  // Set HTTP-only secure signed cookie
  reply.setCookie('hoda_auth_token', token, {
    path: '/',
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    signed: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  // Audit log
  await createAuditLog({
    userId: user.id,
    action: 'LOGIN',
    entity: 'User',
    entityId: user.id,
    ipAddress: request.ip
  });

  return successResponse(reply, {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      schoolId: user.schoolId,
      school: user.school
    },
    token
  }, 'ورود موفقیت‌آمیز بود');
}

export async function logout(request, reply) {
  if (request.user) {
    await createAuditLog({
      userId: request.user.id,
      action: 'LOGOUT',
      entity: 'User',
      entityId: request.user.id,
      ipAddress: request.ip
    });
  }

  reply.clearCookie('hoda_auth_token', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return successResponse(reply, null, 'خروج با موفقیت انجام شد');
}

export async function getMe(request, reply) {
  const { id, username, email, fullName, role, schoolId, school, createdAt, lastLoginAt } = request.user;
  return successResponse(reply, {
    id,
    username,
    email,
    fullName,
    role,
    schoolId,
    school,
    createdAt,
    lastLoginAt
  });
}

export async function changePassword(request, reply) {
  const result = changePasswordSchema.safeParse(request.body);
  if (!result.success) {
    return errorResponse(reply, result.error.errors[0]?.message || 'اطلاعات نامعتبر است', 'VALIDATION_ERROR', 400);
  }

  const { currentPassword, newPassword } = result.data;
  const user = await prisma.user.findUnique({ where: { id: request.user.id } });

  const isValid = await argon2.verify(user.passwordHash, currentPassword);
  if (!isValid) {
    return errorResponse(reply, 'رمز عبور فعلی نادرست است', 'INVALID_PASSWORD', 400);
  }

  const newHash = await argon2.hash(newPassword, { type: argon2.argon2id });
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash }
  });

  await createAuditLog({
    userId: user.id,
    action: 'CHANGE_PASSWORD',
    entity: 'User',
    entityId: user.id,
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'رمز عبور با موفقیت تغییر یافت');
}
