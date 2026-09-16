import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

export async function listSchools(request, reply) {
  const schools = await prisma.school.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: {
          teachers: true,
          facilities: true,
          achievements: true,
        }
      }
    }
  });

  return successResponse(reply, schools);
}

export async function getSchoolById(request, reply) {
  const { id } = request.params;
  const school = await prisma.school.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    },
    include: {
      teachers: { orderBy: { sortOrder: 'asc' } },
      facilities: { orderBy: { sortOrder: 'asc' } },
      achievements: { orderBy: { sortOrder: 'asc' } },
      staff: { orderBy: { sortOrder: 'asc' } },
    }
  });

  if (!school) {
    return errorResponse(reply, 'مدرسه مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  return successResponse(reply, school);
}

export async function updateSchool(request, reply) {
  const { id } = request.params;

  // Authorization check for SchoolAdmin: can only update their own school
  if (request.user.role === 'SCHOOL_ADMIN' && request.user.schoolId !== id) {
    const s = await prisma.school.findUnique({ where: { id } });
    if (!s || s.id !== request.user.schoolId) {
      return errorResponse(reply, 'شما فقط مجاز به ویرایش مدرسه اختصاصی خود هستید', 'FORBIDDEN', 403);
    }
  }

  const existing = await prisma.school.findUnique({ where: { id } });
  if (!existing) {
    return errorResponse(reply, 'مدرسه مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  const {
    shortName,
    fullName,
    subtitle,
    tag,
    themeColor,
    icon3dUrl,
    overview,
    quranicProgramTitle,
    quranicProgramFeatures,
    phone,
    email,
    address,
    stats,
    isActive,
    sortOrder,
  } = request.body;

  const updated = await prisma.school.update({
    where: { id },
    data: {
      ...(shortName !== undefined && { shortName }),
      ...(fullName !== undefined && { fullName }),
      ...(subtitle !== undefined && { subtitle }),
      ...(tag !== undefined && { tag }),
      ...(themeColor !== undefined && { themeColor }),
      ...(icon3dUrl !== undefined && { icon3dUrl }),
      ...(overview !== undefined && { overview }),
      ...(quranicProgramTitle !== undefined && { quranicProgramTitle }),
      ...(quranicProgramFeatures !== undefined && {
        quranicProgramFeatures: typeof quranicProgramFeatures === 'object' ? JSON.stringify(quranicProgramFeatures) : quranicProgramFeatures
      }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(address !== undefined && { address }),
      ...(stats !== undefined && {
        stats: typeof stats === 'object' ? JSON.stringify(stats) : stats
      }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_SCHOOL',
    entity: 'School',
    entityId: id,
    oldValues: { shortName: existing.shortName },
    newValues: { shortName: updated.shortName },
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد');
}
