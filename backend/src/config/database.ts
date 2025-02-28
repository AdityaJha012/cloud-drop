import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

// Create logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty'
  }
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DATABASE || 'fileupload';

export const client = new MongoClient(mongoUri);
export const db = client.db(dbName);

export const connectToDatabase = async (): Promise<void> => {
  try {
    logger.info(`Attempting to connect to MongoDB at: ${mongoUri}`);
    logger.info(`Using database: ${dbName}`);
    
    await client.connect();
    
    // Test the connection by listing databases
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    
    if (result && result.ok === 1) {
      logger.info('MongoDB connection successful!');
      
      // List available databases
      const dbList = await client.db().admin().listDatabases();
      const databaseNames = dbList.databases.map(db => db.name).join(', ');
      logger.info(`Available databases: ${databaseNames}`);
      
      // Check if our target database exists in the list
      const dbExists = dbList.databases.some(db => db.name === dbName);
      if (!dbExists) {
        logger.warn(`Database '${dbName}' doesn't exist yet. It will be created upon first document insertion.`);
      } else {
        logger.info(`Database '${dbName}' found.`);
      }
    } else {
      logger.error('MongoDB connection test failed.');
    }
  } catch (error) {
    logger.error(error, 'Failed to connect to MongoDB:');
    logger.error('Please check if your MongoDB server is running and the connection string is correct.');
    process.exit(1);
  }
};
