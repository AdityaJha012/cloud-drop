// src/types/fastify.d.ts
import { ObjectId } from "mongodb";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: ObjectId;
  }
}
