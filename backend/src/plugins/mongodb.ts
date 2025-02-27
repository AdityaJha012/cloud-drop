import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { MongoClient } from 'mongodb';
import { drizzle } from 'drizzle-orm/mongodb';
import { env } from '../config/env';

// Extend FastifyInstance interface
declare module 'fastify' {
  interface FastifyInstance {
    mongo: {
      client: MongoClient;
      db: ReturnType<MongoClient['db']>;
      drizzle: ReturnType<typeof drizzle>;
    };
  }
}

const connectMongoDBPlugin: FastifyPluginAsync = async (fastify) => {
  // Create MongoDB client
  const client = new MongoClient(env.MONGODB_URI);
  
  try {
    // Connect to MongoDB
    await client.connect();
    
    // Get database instance
    const db = client.db(env.MONGODB_DB_NAME);
    
    // Initialize Drizzle with MongoDB
    const drizzleInstance = drizzle(db);
    
    // Add MongoDB client and Drizzle to Fastify instance
    fastify.decorate('mongo', {
      client,
      db,
      drizzle: drizzleInstance,
    });
    
    // Close connection when server closes
    fastify.addHook('onClose', async (instance, done) => {
      await client.close();
      done();
    });
    
    fastify.log.info('Connected to MongoDB');
  } catch (error) {
    fastify.log.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const connectMongoDB = fp(connectMongoDBPlugin);
