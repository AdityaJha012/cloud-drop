import { db } from '../config/database';
import { FileMetadata, User } from '../types/types';

export const filesCollection = db.collection<FileMetadata>('files');
export const usersCollection = db.collection<User>('users');

// Create indexes for better query performance
export const setupIndexes = async (): Promise<void> => {
  await filesCollection.createIndex({ id: 1 }, { unique: true });
  await filesCollection.createIndex({ filename: 1 });
  await filesCollection.createIndex({ mimeType: 1 });
  await filesCollection.createIndex({ uploadedAt: 1 });

  await usersCollection.createIndex({ id: 1 }, { unique: true });
  await usersCollection.createIndex({ name: 1 });
  await usersCollection.createIndex({ email: 1 });
};
