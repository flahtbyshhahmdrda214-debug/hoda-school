import prisma from '../services/prisma.js';
import { errorResponse } from '../utils/response.js';

export async function authenticate(request, reply) {
  try {
    let token = null;

    // Check signed cookie first
    if (request.cookies && request.cookies.hoda_auth_token) {
      const unsigned = request.unsignCookie(request.cookies.hoda_auth_token);
      if (unsigned.valid) {
        token = unsigned.value;
      }
    }

    // Fallback to Bearer authorization header
    if (!token && request.headers.authorization) {
      const parts = request.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (!token) {
      return errorResponse(reply, 'لطفاً ابتدا وارد حساب کاربری خود شوید', 'UNAUTHORIZED', 401);
    }

    const decoded = request.server.jwt.verify(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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
      return errorResponse(reply, 'حساب کاربری نامعتبر یا غیرفعال است', 'UNAUTHORIZED', 401);
    }

    request.user = user;
  } catch (err) {
    return errorResponse(reply, 'نشست کاربری منقضی شده است. مجدداً وارد شوید', 'UNAUTHORIZED', 401);
  }
}

export function authorize(allowedRoles = []) {
  return async (request, reply) => {
    if (!request.user) {
      return errorResponse(reply, 'دسترسی غیرمجاز', 'UNAUTHORIZED', 401);
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(request.user.role)) {
      return errorResponse(reply, 'شما مجوز لازم برای انجام این عملیات را ندارید', 'FORBIDDEN', 403);
    }
  };
}

export async function schoolScope(request, reply) {
  if (!request.user) return;
  if (request.user.role === 'SUPERADMIN') return; // Superadmin has full access across all schools

  if (request.user.role === 'SCHOOL_ADMIN' || request.user.role === 'EDITOR') {
    if (!request.user.schoolId) {
      return errorResponse(reply, 'حساب شما به هیچ مدرسه‌ای متصل نیست', 'FORBIDDEN', 403);
    }
    // Inject school constraint into params/query/body
    request.enforcedSchoolId = request.user.schoolId;
  }
}

export async function createAuditLog({ userId, action, entity, entityId = null, oldValues = null, newValues = null, ipAddress = null }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress,
      }
    });
  } catch (e) {
    console.error('Failed to create audit log:', e);
  }
}
