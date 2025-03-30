import { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../services/authService";
import pino from 'pino';

// Create logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty'
  }
});

export class AuthController {
  async registerUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { name, email, password } = request.body as {
        name: string;
        email: string;
        password: string;
      };

      const result = await authService.registerUser(name, email, password);

      return reply.status(201).send(result);
    } catch (error: any) {
      logger.error('Error registering user:', error);
      return reply.status(500).send({ error: error.message || 'Failed to register user' });
    }
  }

  async loginUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };

      const result = await authService.loginUser(email, password);

      return reply.status(201).send(result);
    } catch (error: any) {
      logger.error('Error logging in user:', error);
      return reply.status(500).send({ error: error.message || 'Failed to login user' });
    }
  }
}

export const authController = new AuthController();
