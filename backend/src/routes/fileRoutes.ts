import { FastifyInstance } from 'fastify';
import { fileController } from '../controllers/fileController';

export const registerFileRoutes = (server: FastifyInstance): void => {
  // Upload a single file
  server.post('/api/files/upload', fileController.uploadSingleFile);
  
  // Upload multiple files
  server.post('/api/files/upload-multiple', fileController.uploadMultipleFiles);
  
  // Get all files (with optional filters and pagination)
  server.get('/api/files', fileController.getAllFiles);
  
  // Get a file by ID
  server.get('/api/files/:id', fileController.getFileById);
  
  // Delete a file by ID
  server.delete('/api/files/:id', fileController.deleteFile);
};
