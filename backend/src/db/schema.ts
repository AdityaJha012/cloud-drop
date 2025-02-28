import { db } from '../config/database';
import { FileMetadata } from '../types/file';

export const filesCollection = db.collection<FileMetadata>('files');

// Create indexes for better query performance
export const setupIndexes = async (): Promise<void> => {
  await filesCollection.createIndex({ id: 1 }, { unique: true });
  await filesCollection.createIndex({ filename: 1 });
  await filesCollection.createIndex({ mimeType: 1 });
  await filesCollection.createIndex({ uploadedAt: 1 });
};
