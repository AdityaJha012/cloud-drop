import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/authController';

export const registerAuthRoutes = (server: FastifyInstance): void => {
  // Register a new user
  server.post('/api/auth/register', authController.registerUser);
  
  // Login a user
  server.post('/api/auth/login', authController.loginUser);

  // Verify token
  server.get('/api/auth/verify', authController.verifyUser);
};
