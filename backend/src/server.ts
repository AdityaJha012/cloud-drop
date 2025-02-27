import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { connectMinio } from './plugins/minio';
import { connectMongoDB } from './plugins/mongodb';
import fileRoutes from './routes/file-routes';
import { env } from './config/env';

// Create Fastify instance
const server = Fastify({
  logger: true,
  maxParamLength: 100,
});

// Register plugins
server.register(cors, {
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});

server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Register custom plugins
server.register(connectMinio);
server.register(connectMongoDB);

// Register routes
server.register(fileRoutes, { prefix: '/api/files' });

// Health check endpoint
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    await server.listen({ 
      port: env.PORT, 
      host: env.HOST
    });
    console.log(`Server listening on ${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
