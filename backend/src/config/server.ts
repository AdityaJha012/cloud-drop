import dotenv from 'dotenv';

dotenv.config();

export const SERVER_CONFIG = {
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || '127.0.0.1',
  logger: true
};

export const FILE_UPLOAD_LIMITS = {
  maxFileSize: 1024 * 1024 * 50, // 50MB
  maxFiles: 10,
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'audio/mpeg',
    'video/mp4',
    'application/zip'
  ]
};
