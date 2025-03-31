import { filesCollection } from '../db/schema';
import { minioService } from './minioService';
import { FileMetadata, UploadedFile, FileFilter, PaginationOptions, FileListResult } from '../types/types';
import { Readable } from 'stream';
import { ObjectId } from 'mongodb';

export class FileService {
  /**
   * Upload a single file
   */
  async uploadSingleFile(
    fileStream: Readable,
    filename: string,
    mimeType: string,
    size: number,
    userId: ObjectId | undefined
  ): Promise<UploadedFile> {
    const metadata = await minioService.uploadFile(fileStream, filename, mimeType, size, userId);
    
    // Store metadata in MongoDB
    await filesCollection.insertOne(metadata);
    
    // Generate a URL for the file
    const url = await minioService.getFileUrl(metadata.path);
    
    return { metadata, url };
  }
  
  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: Array<{
      fileStream: Readable,
      filename: string,
      mimeType: string,
      size: number,
    }>,
    userId: ObjectId | undefined
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map(file => 
      this.uploadSingleFile(file.fileStream, file.filename, file.mimeType, file.size, userId)
    );
    
    return Promise.all(uploadPromises);
  }
  
  /**
   * Get a file by ID
   */
  async getFileById(id: string): Promise<UploadedFile | null> {
    const metadata = await filesCollection.findOne({ id });
    
    if (!metadata) {
      return null;
    }
    
    const url = await minioService.getFileUrl(metadata.path);
    
    return { metadata, url };
  }
  
  /**
   * Delete a file by ID
   */
  async deleteFile(id: string): Promise<boolean> {
    const metadata = await filesCollection.findOne({ id });
    
    if (!metadata) {
      return false;
    }
    
    // Delete from MinIO
    await minioService.deleteFile(metadata.path);
    
    // Delete from MongoDB
    await filesCollection.deleteOne({ id });
    
    return true;
  }
  
  /**
   * List files with filtering and pagination
   */
  async listFiles(
    filter: FileFilter = {},
    paginationOptions: PaginationOptions = { page: 1, limit: 20 }
  ): Promise<FileListResult> {
    const { page, limit } = paginationOptions;
    const skip = (page - 1) * limit;
    
    // Build the query
    const query: any = {};
    
    if (filter.id) {
      query.id = filter.id;
    }
    
    if (filter.filename) {
      query.filename = { $regex: filter.filename, $options: 'i' };
    }
    
    if (filter.mimeType) {
      query.mimeType = filter.mimeType;
    }
    
    if (filter.uploadedAt) {
      query.uploadedAt = {};
      
      if (filter.uploadedAt.from) {
        query.uploadedAt.$gte = filter.uploadedAt.from;
      }
      
      if (filter.uploadedAt.to) {
        query.uploadedAt.$lte = filter.uploadedAt.to;
      }
    }
    
    // Count total documents
    const total = await filesCollection.countDocuments(query);
    
    // Get documents with pagination
    const files = await filesCollection
      .find(query)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Generate URLs for each file
    const filesWithUrls = await Promise.all(
      files.map(async (metadata: FileMetadata) => {
        const url = await minioService.getFileUrl(metadata.path);
        return { metadata, url };
      })
    );
    
    return {
      files: filesWithUrls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

export const fileService = new FileService();
