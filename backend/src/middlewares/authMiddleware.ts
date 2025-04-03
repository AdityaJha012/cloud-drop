import { FastifyRequest, FastifyReply } from "fastify";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import { usersCollection } from "../db/schema";

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

export async function authorize(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized: No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    if (!decoded || !decoded.id) {
      return reply.status(401).send({ error: "Unauthorized: Invalid token" });
    }

    // Check if user exists in MongoDB
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });

    if (!user) {
      return reply.status(401).send({ error: "Unauthorized: User not found" });
    }

    // Attach user data to the request
    request.userId = user._id;
  } catch (error) {
    console.error("Authorization error:", error);
    return reply.status(401).send({ error: "Unauthorized: Invalid or expired token" });
  }
}
