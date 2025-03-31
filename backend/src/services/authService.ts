import { usersCollection } from '../db/schema';
import bcrypt from 'bcryptjs';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

// Create logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty'
  }
});

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export class AuthService {
  async registerUser(
    name: string,
    email: string,
    password: string
  ) {
    try {
      const user = await usersCollection.findOne({ email });

      if (user) {
        throw new Error('User already exists');
      }

      // Salt and hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Save the user
      const result = await usersCollection.insertOne({ 
        id: uuidv4(), 
        name, 
        email, 
        password: hashedPassword
      });

      if (result.insertedId) {
        return { success: true, message: "User registered successfully, please log in." };
      } else {
        return { success: false, message: "Failed to register user." };
      }
    } catch (error) {
      logger.error("Error registering user:", error);
      return { success: false, message: "An error occurred while registering user." };
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await usersCollection.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user._id, email: user.email }, // Payload
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return { success: true, token, message: "User logged in successfully" };
    } catch (error) {
      logger.error("Error logging in user:", error);
      return { success: false, message: "An error occurred while logging in user." };
    }
  }
}

export const authService = new AuthService();
