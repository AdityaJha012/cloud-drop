import { ObjectId } from 'mongodb';

// For MongoDB with Drizzle we need to create the schema
export const fileSchema = {
  id: { type: 'objectId', primaryKey: true },
  filename: { type: 'string' },
  originalFilename: { type: 'string' },
  mimetype: { type: 'string' },
  size: { type: 'number' },
  url: { type: 'string' },
  bucketName: { type: 'string' },
  isPublic: { type: 'boolean', default: true },
  createdAt: { type: 'date' },
  updatedAt: { type: 'date' },
  userId: { type: 'string', optional: true }, // For when you add authentication
};

// Interface for file documents
export interface FileDocument {
  _id: ObjectId;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  url: string;
  bucketName: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

// Helper function to create a new file document
export const createFileDocument = (data: Omit<FileDocument, '_id' | 'createdAt' | 'updatedAt'>): FileDocument => {
  return {
    _id: new ObjectId(),
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};
