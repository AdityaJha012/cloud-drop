import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';
import { SERVER_CONFIG } from './config/server';
import { initializeDatabase } from './db';
import { initializeMinio } from './config/minio';
import { registerFileRoutes } from './routes/fileRoutes';
import pino from 'pino';

// Create logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty'
  }
});

const startServer = async () => {
  try {
    logger.info('Starting File Upload API Service...');
    logger.info('----------------------------------------');
    
    // Check environment variables
    logger.info('Environment configuration:');
    logger.info(`Server port: ${SERVER_CONFIG.port}`);
    logger.info(`Server host: ${SERVER_CONFIG.host}`);
    
    // Initialize dependencies
    logger.info('----------------------------------------');
    logger.info('Step 1/4: Initializing database connection...');
    await initializeDatabase();
    
    logger.info('----------------------------------------');
    logger.info('Step 2/4: Initializing MinIO connection...');
    await initializeMinio();
    
    // Create Fastify instance
    logger.info('----------------------------------------');
    logger.info('Step 3/4: Setting up Fastify server...');
    const server = Fastify({
      logger: SERVER_CONFIG.logger
    });
    
    // Register plugins
    logger.info('Registering CORS plugin...');
    await server.register(fastifyCors, {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    });
    
    logger.info('Registering Multipart plugin...');
    await server.register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100,
        fieldSize: 100,
        fields: 10,
        fileSize: 50 * 1024 * 1024, // 50MB
        files: 10,
        headerPairs: 2000
      }
    });
    
    // Register routes
    logger.info('Registering API routes...');
    registerFileRoutes(server);
    
    // Health check route
    server.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });
    
    // Start the server
    logger.info('----------------------------------------');
    logger.info('Step 4/4: Starting HTTP server...');
    await server.listen({
      port: SERVER_CONFIG.port,
      host: SERVER_CONFIG.host
    });
    
    logger.info('----------------------------------------');
    logger.info(`Server running at http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
    logger.info('Available API endpoints:');
    logger.info('- POST   /api/files/upload           (Upload a single file)');
    logger.info('- POST   /api/files/upload-multiple  (Upload multiple files)');
    logger.info('- GET    /api/files                  (List all files)');
    logger.info('- GET    /api/files/:id              (Get file by ID)');
    logger.info('- DELETE /api/files/:id              (Delete file by ID)');
    logger.info('- GET    /health                     (Health check)');
    logger.info('----------------------------------------');
  } catch (error) {
    logger.error(error, 'Error starting server:');
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(error, 'Uncaught Exception');
  process.exit(1);
});

startServer();
