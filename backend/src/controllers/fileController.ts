import { FastifyRequest, FastifyReply } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { fileService } from '../services/fileService';
import { FILE_UPLOAD_LIMITS } from '../config/server';
import { FileFilter, PaginationOptions } from '../types/types';

export class FileController {
  /**
   * Upload a single file
   */
  async uploadSingleFile(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // Extract the User Id
      const userId = request.userId;

      const data = await request.file();
      
      if (!data) {
        return reply.status(400).send({ error: 'No file provided' });
      }
      
      // Check file size
      if (data.file.bytesRead > FILE_UPLOAD_LIMITS.maxFileSize) {
        return reply.status(400).send({ 
          error: `File size exceeds the limit of ${FILE_UPLOAD_LIMITS.maxFileSize / (1024 * 1024)}MB` 
        });
      }
      
      // Check MIME type
      if (!FILE_UPLOAD_LIMITS.allowedMimeTypes.includes(data.mimetype)) {
        return reply.status(400).send({ 
          error: 'File type not allowed',
          allowedTypes: FILE_UPLOAD_LIMITS.allowedMimeTypes
        });
      }
      
      const result = await fileService.uploadSingleFile(
        data.file, 
        data.filename, 
        data.mimetype, 
        data.file.bytesRead,
        userId
      );
      
      return reply.status(201).send(result);
    } catch (error) {
      console.error('Error uploading file:', error);
      return reply.status(500).send({ error: 'Failed to upload file' });
    }
  }
  
  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      // Extract user id
      const userId = request.userId;

      const parts = request.parts();

      const files: Array<{
        fileStream: any,
        filename: string,
        mimeType: string,
        size: number
      }> = [];
      
      let fileCount = 0;
      
      for await (const part of parts) {
        if (part.type === 'file') {
          fileCount++;
          
          if (fileCount > FILE_UPLOAD_LIMITS.maxFiles) {
            return reply.status(400).send({ 
              error: `Too many files. Maximum allowed is ${FILE_UPLOAD_LIMITS.maxFiles}` 
            });
          }
          
          const file = part as MultipartFile;
          
          // Check file size
          if (file.file.bytesRead > FILE_UPLOAD_LIMITS.maxFileSize) {
            return reply.status(400).send({ 
              error: `File ${file.filename} exceeds the size limit of ${FILE_UPLOAD_LIMITS.maxFileSize / (1024 * 1024)}MB` 
            });
          }
          
          // Check MIME type
          if (!FILE_UPLOAD_LIMITS.allowedMimeTypes.includes(file.mimetype)) {
            return reply.status(400).send({ 
              error: `File type for ${file.filename} not allowed`,
              allowedTypes: FILE_UPLOAD_LIMITS.allowedMimeTypes
            });
          }
          
          files.push({
            fileStream: file.file,
            filename: file.filename,
            mimeType: file.mimetype,
            size: file.file.bytesRead
          });
        }
      }
      
      if (files.length === 0) {
        return reply.status(400).send({ error: 'No files provided' });
      }
      
      const results = await fileService.uploadMultipleFiles(files, userId);
      
      return reply.status(201).send(results);
    } catch (error) {
      console.error('Error uploading files:', error);
      return reply.status(500).send({ error: 'Failed to upload files' });
    }
  }
  
  /**
   * Get all files with filters and pagination
   */
  async getAllFiles(
    request: FastifyRequest<{
      Querystring: {
        page?: number;
        limit?: number;
        id?: string;
        filename?: string;
        mimeType?: string;
        fromDate?: string;
        toDate?: string;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { page = 1, limit = 20, id, filename, mimeType, fromDate, toDate } = request.query;
      
      const filter: FileFilter = {};
      
      if (id) filter.id = id;
      if (filename) filter.filename = filename;
      if (mimeType) filter.mimeType = mimeType;
      
      if (fromDate || toDate) {
        filter.uploadedAt = {};
        
        if (fromDate) {
          filter.uploadedAt.from = new Date(fromDate);
        }
        
        if (toDate) {
          filter.uploadedAt.to = new Date(toDate);
        }
      }
      
      const paginationOptions: PaginationOptions = {
        page: Math.max(1, page),
        limit: Math.min(100, Math.max(1, limit))
      };
      
      const results = await fileService.listFiles(filter, paginationOptions);
      
      return reply.send(results);
    } catch (error) {
      console.error('Error getting files:', error);
      return reply.status(500).send({ error: 'Failed to get files' });
    }
  }
  
  /**
   * Get a single file by ID
   */
  async getFileById(
    request: FastifyRequest<{
      Params: {
        id: string;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      
      const file = await fileService.getFileById(id);
      
      if (!file) {
        return reply.status(404).send({ error: 'File not found' });
      }
      
      return reply.send(file);
    } catch (error) {
      console.error('Error getting file:', error);
      return reply.status(500).send({ error: 'Failed to get file' });
    }
  }
  
  /**
   * Delete a file by ID
   */
  async deleteFile(
    request: FastifyRequest<{
      Params: {
        id: string;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      
      const deleted = await fileService.deleteFile(id);
      
      if (!deleted) {
        return reply.status(404).send({ error: 'File not found' });
      }
      
      return reply.send({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      return reply.status(500).send({ error: 'Failed to delete file' });
    }
  }
}

export const fileController = new FileController();
