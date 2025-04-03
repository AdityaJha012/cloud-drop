import { FastifyInstance } from 'fastify';
import { fileController } from '../controllers/fileController';
import { authorize } from '../middlewares/authMiddleware';
import { FileQueryString } from '../types/types';

export const registerFileRoutes = (server: FastifyInstance): void => {
  // Upload a single file
  server.post('/api/files/upload', { preHandler: authorize }, fileController.uploadSingleFile);
  
  // Get all files
  server.get<{ Querystring: FileQueryString }>('/api/files', { preHandler: authorize }, fileController.getAllFiles);
  
  // Delete a file by ID
  server.delete<{ Params: { id: string } }>('/api/files/:id', { preHandler: authorize }, fileController.deleteFile);
};
