import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { config } from '../config/index.js';
import prisma from './prisma.js';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export async function processAndSaveFile({ buffer, originalFilename, folder = 'general', userId = null }) {
  // 1. Verify MIME type by magic numbers
  const detectedType = await fileTypeFromBuffer(buffer);
  const mimeType = detectedType ? detectedType.mime : null;

  if (!mimeType || !ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error('فرمت فایل نامعتبر است. فرمت‌های مجاز: JPG, PNG, WEBP, PDF');
  }

  // Ensure upload directory exists
  const targetDir = path.join(config.storage.uploadDir, folder);
  await fs.mkdir(targetDir, { recursive: true });

  const randomId = crypto.randomBytes(8).toString('hex');
  const timestamp = Date.now();

  let finalFilename = '';
  let finalMime = mimeType;
  let finalSizeBytes = buffer.length;
  let thumbUrl = null;

  if (mimeType.startsWith('image/') && mimeType !== 'image/gif') {
    // Convert images to WebP
    finalFilename = `${timestamp}-${randomId}.webp`;
    const finalFilePath = path.join(targetDir, finalFilename);

    const processedImage = await sharp(buffer)
      .rotate() // Auto-orient according to EXIF
      .webp({ quality: 85 })
      .toBuffer();

    await fs.writeFile(finalFilePath, processedImage);
    finalMime = 'image/webp';
    finalSizeBytes = processedImage.length;

    // Generate thumbnail
    const thumbFilename = `${timestamp}-${randomId}-thumb.webp`;
    const thumbFilePath = path.join(targetDir, thumbFilename);
    const thumbBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 350, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    await fs.writeFile(thumbFilePath, thumbBuffer);
    thumbUrl = `/uploads/${folder}/${thumbFilename}`;
  } else {
    // For PDFs and GIFs, save original
    const ext = path.extname(originalFilename) || (detectedType ? `.${detectedType.ext}` : '.bin');
    finalFilename = `${timestamp}-${randomId}${ext}`;
    const finalFilePath = path.join(targetDir, finalFilename);
    await fs.writeFile(finalFilePath, buffer);
  }

  const fileUrl = `/uploads/${folder}/${finalFilename}`;

  // Record in database
  const mediaRecord = await prisma.media.create({
    data: {
      filename: finalFilename,
      originalName: originalFilename || finalFilename,
      mimeType: finalMime,
      sizeBytes: finalSizeBytes,
      url: fileUrl,
      thumbnailUrl: thumbUrl,
      folder,
      uploadedById: userId,
    }
  });

  return mediaRecord;
}

export async function removeMediaFile(mediaRecord) {
  try {
    const filePath = path.join(config.storage.uploadDir, mediaRecord.folder, mediaRecord.filename);
    await fs.unlink(filePath).catch(() => {});

    if (mediaRecord.thumbnailUrl) {
      const thumbFilename = path.basename(mediaRecord.thumbnailUrl);
      const thumbPath = path.join(config.storage.uploadDir, mediaRecord.folder, thumbFilename);
      await fs.unlink(thumbPath).catch(() => {});
    }

    await prisma.media.delete({ where: { id: mediaRecord.id } });
  } catch (err) {
    console.error('Error removing media file:', err);
  }
}
