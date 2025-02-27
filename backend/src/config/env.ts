export const env = {
  PORT: parseInt(process.env.PORT || '3000'),
  HOST: process.env.HOST || '0.0.0.0',
  
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fileuploader',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'fileuploader',
  
  // MinIO Configuration
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: parseInt(process.env.MINIO_PORT || '9000'),
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minioadmin',
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',
  MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME || 'fileupload-bucket',
};
