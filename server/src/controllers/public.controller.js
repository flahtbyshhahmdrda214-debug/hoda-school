import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function getPublicSchools(request, reply) {
  const schools = await prisma.school.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      slug: true,
      shortName: true,
      fullName: true,
      subtitle: true,
      tag: true,
      themeColor: true,
      icon3dUrl: true,
      phone: true,
      email: true,
      address: true,
      stats: true,
      overview: true,
      quranicProgramTitle: true,
      quranicProgramFeatures: true,
    }
  });

  const parsed = schools.map(s => ({
    ...s,
    stats: s.stats ? JSON.parse(s.stats) : [],
    quranicProgramFeatures: s.quranicProgramFeatures ? JSON.parse(s.quranicProgramFeatures) : [],
  }));

  return successResponse(reply, parsed);
}

export async function getPublicSchoolBySlug(request, reply) {
  const { slug } = request.params;
  const school = await prisma.school.findUnique({
    where: { slug },
    include: {
      teachers: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      },
      facilities: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      },
      achievements: {
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
      },
      news: {
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          coverImageUrl: true,
          category: true,
          publishedAt: true,
        }
      }
    }
  });

  if (!school || !school.isActive) {
    return errorResponse(reply, 'مدرسه مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  const responseData = {
    ...school,
    stats: school.stats ? JSON.parse(school.stats) : [],
    quranicProgramFeatures: school.quranicProgramFeatures ? JSON.parse(school.quranicProgramFeatures) : [],
  };

  return successResponse(reply, responseData);
}

export async function getPublicNews(request, reply) {
  const { category, schoolSlug, page = 1, limit = 12 } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = { isPublished: true };
  if (category) where.category = category;
  if (schoolSlug) {
    where.school = { slug: schoolSlug };
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: Number(limit),
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        coverImageUrl: true,
        category: true,
        isFeatured: true,
        publishedAt: true,
        viewsCount: true,
        school: {
          select: { id: true, shortName: true, slug: true, themeColor: true }
        }
      }
    }),
    prisma.news.count({ where })
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

export async function getPublicNewsBySlug(request, reply) {
  const { slug } = request.params;
  const news = await prisma.news.findUnique({
    where: { slug },
    include: {
      school: {
        select: { id: true, shortName: true, slug: true, themeColor: true }
      },
      author: {
        select: { fullName: true }
      }
    }
  });

  if (!news || !news.isPublished) {
    return errorResponse(reply, 'خبر مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  // Increment views count in background
  prisma.news.update({
    where: { id: news.id },
    data: { viewsCount: { increment: 1 } }
  }).catch(() => {});

  return successResponse(reply, news);
}

export async function getPublicDocuments(request, reply) {
  const documents = await prisma.document.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' }
  });

  return successResponse(reply, documents);
}

export async function getPublicSettings(request, reply) {
  const settings = await prisma.siteSetting.findMany();
  const formatted = {};
  for (const s of settings) {
    try {
      formatted[s.key] = JSON.parse(s.value);
    } catch {
      formatted[s.key] = s.value;
    }
  }
  return successResponse(reply, formatted);
}
