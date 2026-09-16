import sanitizeHtml from 'sanitize-html';
import prisma from '../services/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { createAuditLog } from '../middleware/auth.js';

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span'
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    span: ['class', 'style'],
    div: ['class'],
    p: ['class'],
    table: ['class', 'border'],
  },
  selfClosing: ['img', 'br', 'hr'],
  allowedSchemes: ['http', 'https', 'data'],
};

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^؀-ۿa-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100) + '-' + Date.now().toString().slice(-4);
}

export async function listNews(request, reply) {
  const { category, schoolId, isPublished, search, page = 1, limit = 20 } = request.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (category) where.category = category;
  if (schoolId) where.schoolId = schoolId;
  if (isPublished !== undefined) where.isPublished = isPublished === 'true';
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { summary: { contains: search } }
    ];
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: Number(limit),
      include: {
        school: { select: { id: true, shortName: true, slug: true } },
        author: { select: { id: true, fullName: true, username: true } },
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

export async function getNewsById(request, reply) {
  const { id } = request.params;
  const news = await prisma.news.findFirst({
    where: {
      OR: [{ id }, { slug: id }]
    },
    include: {
      school: { select: { id: true, shortName: true, slug: true } },
      author: { select: { id: true, fullName: true, username: true } },
    }
  });

  if (!news) {
    return errorResponse(reply, 'خبر مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  return successResponse(reply, news);
}

export async function createNews(request, reply) {
  const { title, summary, contentHtml, coverImageUrl, category, schoolId, isFeatured, isPublished } = request.body;

  if (!title || !summary || !contentHtml || !category) {
    return errorResponse(reply, 'عنوان، خلاصه، متن خبر و دسته‌بندی الزامی هستند', 'VALIDATION_ERROR', 400);
  }

  const cleanContentHtml = sanitizeHtml(contentHtml, SANITIZE_OPTIONS);
  const slug = generateSlug(title);

  const news = await prisma.news.create({
    data: {
      slug,
      title,
      summary,
      contentHtml: cleanContentHtml,
      coverImageUrl,
      category,
      schoolId: schoolId || null,
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      authorId: request.user?.id,
    }
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'CREATE_NEWS',
    entity: 'News',
    entityId: news.id,
    newValues: { title, slug },
    ipAddress: request.ip
  });

  return successResponse(reply, news, 'خبر با موفقیت ایجاد شد', 201);
}

export async function updateNews(request, reply) {
  const { id } = request.params;
  const existing = await prisma.news.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'خبر مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  const { title, summary, contentHtml, coverImageUrl, category, schoolId, isFeatured, isPublished } = request.body;

  const data = {};
  if (title !== undefined) data.title = title;
  if (summary !== undefined) data.summary = summary;
  if (contentHtml !== undefined) data.contentHtml = sanitizeHtml(contentHtml, SANITIZE_OPTIONS);
  if (coverImageUrl !== undefined) data.coverImageUrl = coverImageUrl;
  if (category !== undefined) data.category = category;
  if (schoolId !== undefined) data.schoolId = schoolId || null;
  if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);
  if (isPublished !== undefined) data.isPublished = Boolean(isPublished);

  const updated = await prisma.news.update({
    where: { id },
    data
  });

  await createAuditLog({
    userId: request.user.id,
    action: 'UPDATE_NEWS',
    entity: 'News',
    entityId: id,
    newValues: { title: updated.title },
    ipAddress: request.ip
  });

  return successResponse(reply, updated, 'خبر با موفقیت به‌روزرسانی شد');
}

export async function deleteNews(request, reply) {
  const { id } = request.params;
  const existing = await prisma.news.findUnique({ where: { id } });

  if (!existing) {
    return errorResponse(reply, 'خبر مورد نظر یافت نشد', 'NOT_FOUND', 404);
  }

  await prisma.news.delete({ where: { id } });

  await createAuditLog({
    userId: request.user.id,
    action: 'DELETE_NEWS',
    entity: 'News',
    entityId: id,
    oldValues: { title: existing.title },
    ipAddress: request.ip
  });

  return successResponse(reply, null, 'خبر با موفقیت حذف شد');
}
