import { FastifyInstance } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { createFileDocument, FileDocument } from '../db/schema';
import { env } from '../config/env';
import { randomUUID } from 'crypto';
import path from 'path';

export class FileService {
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  // Generate a unique filename
  private generateUniqueFilename(originalFilename: string): string {
    const ext = path.extname(originalFilename);
    const baseName = path.basename(originalFilename, ext);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    return `${sanitizedBaseName}-${randomUUID()}${ext}`;
  }

  // Upload file to MinIO
  async uploadFile(file: MultipartFile): Promise<FileDocument> {
    const { filename, mimetype, file: fileStream } = file;
    
    // Generate a unique filename to prevent collisions
    const uniqueFilename = this.generateUniqueFilename(filename);
    
    // Get file size by consuming the stream
    let size = 0;
    const chunks: Buffer[] = [];
    
    for await (const chunk of fileStream) {
      size += chunk.length;
      chunks.push(chunk);
    }
    
    // Create a new readable stream from the consumed chunks
    const bufferStream = new Readable();
    bufferStream.push(Buffer.concat(chunks));
    bufferStream.push(null); // Signal the end of the stream
    
    // Upload to MinIO
    await this.fastify.minio.putObject(
      env.MINIO_BUCKET_NAME,
      uniqueFilename,
      bufferStream,
      size,
      { 'Content-Type': mimetype }
    );
    
    // Generate URL
    let fileUrl: string;
    if (env.MINIO_USE_SSL) {
      fileUrl = `https://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${env.MINIO_BUCKET_NAME}/${uniqueFilename}`;
    } else {
      fileUrl = `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${env.MINIO_BUCKET_NAME}/${uniqueFilename}`;
    }
    
    // Create file document
    const fileDocument = createFileDocument({
      filename: uniqueFilename,
      originalFilename: filename,
      mimetype,
      size,
      url: fileUrl,
      bucketName: env.MINIO_BUCKET_NAME,
      isPublic: true
    });
    
    // Save to MongoDB
    const result = await this.fastify.mongo.db
      .collection('files')
      .insertOne(fileDocument);
    
    return fileDocument;
  }

  // Get file metadata by ID
  async getFileById(id: string): Promise<FileDocument | null> {
    try {
      const objectId = new ObjectId(id);
      const file = await this.fastify.mongo.db
        .collection('files')
        .findOne({ _id: objectId });
      
      return file as FileDocument | null;
    } catch (error) {
      this.fastify.log.error(`Error getting file by ID: ${id}`, error);
      return null;
    }
  }

  // Get all files
  async getAllFiles(): Promise<FileDocument[]> {
    const files = await this.fastify.mongo.db
      .collection('files')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return files as FileDocument[];
  }

  // Delete file
  async deleteFile(id: string): Promise<boolean> {
    try {
      const objectId = new ObjectId(id);
      const file = await this.getFileById(id);
      
      if (!file) {
        return false;
      }
      
      // Delete from MinIO
      await this.fastify.minio.removeObject(
        env.MINIO_BUCKET_NAME,
        file.filename
      );
      
      // Delete from MongoDB
      await this.fastify.mongo.db
        .collection('files')
        .deleteOne({ _id: objectId });
      
      return true;
    } catch (error) {
      this.fastify.log.error(`Error deleting file: ${id}`, error);
      return false;
    }
  }
}
