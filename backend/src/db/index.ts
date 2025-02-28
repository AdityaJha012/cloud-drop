import { connectToDatabase } from '../config/database';
import { setupIndexes } from './schema';

export const initializeDatabase = async (): Promise<void> => {
  await connectToDatabase();
  await setupIndexes();
};
