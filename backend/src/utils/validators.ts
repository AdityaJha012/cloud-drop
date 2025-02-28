import { FILE_UPLOAD_LIMITS } from '../config/server';
import { ValidationError } from './errors';

export const validateFileSize = (size: number): void => {
  if (size > FILE_UPLOAD_LIMITS.maxFileSize) {
    throw new ValidationError(`File size exceeds the limit of ${FILE_UPLOAD_LIMITS.maxFileSize / (1024 * 1024)}MB`);
  }
};

export const validateMimeType = (mimeType: string): void => {
  if (!FILE_UPLOAD_LIMITS.allowedMimeTypes.includes(mimeType)) {
    throw new ValidationError(`File type ${mimeType} not allowed. Allowed types: ${FILE_UPLOAD_LIMITS.allowedMimeTypes.join(', ')}`);
  }
};

export const validateFileCount = (count: number): void => {
  if (count > FILE_UPLOAD_LIMITS.maxFiles) {
    throw new ValidationError(`Too many files. Maximum allowed is ${FILE_UPLOAD_LIMITS.maxFiles}`);
  }
};
