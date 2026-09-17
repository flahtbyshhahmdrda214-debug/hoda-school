import { listGallery, createGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

export default async function galleryRoutes(fastify, options) {
  fastify.get('/', listGallery);
  fastify.post('/', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN', 'EDITOR'])] }, createGalleryItem);
  fastify.delete('/:id', { preHandler: [authenticate, authorize(['SUPERADMIN', 'SCHOOL_ADMIN'])] }, deleteGalleryItem);
}
