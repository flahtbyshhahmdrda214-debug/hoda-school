import {
  getPublicSchools,
  getPublicSchoolBySlug,
  getPublicNews,
  getPublicNewsBySlug,
  getPublicDocuments,
  getPublicSettings
} from '../controllers/public.controller.js';

export default async function publicRoutes(fastify, options) {
  // Public routes do not require authentication
  fastify.get('/schools', getPublicSchools);
  fastify.get('/schools/:slug', getPublicSchoolBySlug);
  fastify.get('/news', getPublicNews);
  fastify.get('/news/:slug', getPublicNewsBySlug);
  fastify.get('/documents', getPublicDocuments);
  fastify.get('/settings', getPublicSettings);
}
