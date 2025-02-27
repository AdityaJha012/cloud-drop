import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Client } from 'minio';
import { env } from '../config/env';

// Extend FastifyInstance interface
declare module 'fastify' {
  interface FastifyInstance {
    minio: Client;
  }
}

const connectMinioPlugin: FastifyPluginAsync = async (fastify) => {
  // Create MinIO client
  const minioClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: env.MINIO_PORT,
    useSSL: env.MINIO_USE_SSL,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY,
  });

  // Check if bucket exists, create if it doesn't
  const bucketExists = await minioClient.bucketExists(env.MINIO_BUCKET_NAME);
  if (!bucketExists) {
    fastify.log.info(`Creating bucket: ${env.MINIO_BUCKET_NAME}`);
    await minioClient.makeBucket(env.MINIO_BUCKET_NAME, 'us-east-1');
    
    // Set bucket policy to allow public read access (optional)
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${env.MINIO_BUCKET_NAME}/*`],
        },
      ],
    };
    
    await minioClient.setBucketPolicy(
      env.MINIO_BUCKET_NAME,
      JSON.stringify(policy)
    );
  }

  // Add MinIO client to Fastify instance
  fastify.decorate('minio', minioClient);

  // Close connection when server closes
  fastify.addHook('onClose', (instance, done) => {
    done();
  });
};

export const connectMinio = fp(connectMinioPlugin);
