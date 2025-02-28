import { minioClient, bucketName } from '../config/minio';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import { FileMetadata } from '../types/file';
import path from 'path';

export class MinioService {
  /**
   * Upload a file to MinIO
   */
  async uploadFile(
    fileStream: Readable,
    originalFilename: string,
    mimeType: string,
    size: number
  ): Promise<FileMetadata> {
    const id = uuidv4();
    const extension = path.extname(originalFilename);
    const filename = `${id}${extension}`;
    const filePath = `uploads/${filename}`;
    
    await minioClient.putObject(
      bucketName,
      filePath,
      fileStream,
      size,
      { 'Content-Type': mimeType }
    );
    
    const now = new Date();
    
    return {
      id,
      filename,
      originalFilename,
      mimeType,
      size,
      bucket: bucketName,
      path: filePath,
      uploadedAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Generate a presigned URL for downloading a file
   */
  async getFileUrl(filePath: string, expiryInSeconds = 60 * 60): Promise<string> {
    return await minioClient.presignedGetObject(bucketName, filePath, expiryInSeconds);
  }
  
  /**
   * Delete a file from MinIO
   */
  async deleteFile(filePath: string): Promise<void> {
    await minioClient.removeObject(bucketName, filePath);
  }
}

export const minioService = new MinioService();
