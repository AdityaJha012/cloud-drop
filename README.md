# CloudDrop - File Upload Application

A modern file upload application with drag-and-drop functionality, camera integration, and real-time progress tracking.

## Features

- Drag and drop file uploads
- Direct camera capture
- Real-time upload progress
- Support for multiple file uploads
- Dark/light mode
- File preview
- MinIO storage backend
- MongoDB metadata storage

## Project Structure

- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Fastify with TypeScript
- **Storage**: MinIO for file storage
- **Database**: MongoDB for metadata storage
- **ORM**: Drizzle for database operations

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose (for MinIO and MongoDB)

### Running the Backend Services

Start MinIO and MongoDB using Docker Compose:

```bash
cd backend
docker-compose up -d
```

### Installing and Running the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will start on http://localhost:3000.

### Installing and Running the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will start on http://localhost:5173.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
HOST=0.0.0.0

# MongoDB Configuration
MONGODB_URI=mongodb://root:password@localhost:27017/fileuploader?authSource=admin
MONGODB_DB_NAME=fileuploader

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=fileupload-bucket
```

## API Endpoints

- `POST /api/files/upload` - Upload a single file
- `POST /api/files/upload/multiple` - Upload multiple files
- `GET /api/files` - Get all files
- `GET /api/files/:id` - Get a specific file
- `DELETE /api/files/:id` - Delete a file

## Frontend Components

- `FileUploader` - Main component for drag-and-drop uploads
- `CameraCapture` - Component for capturing photos
- `FileList` - Component for displaying uploaded files
- `FileItem` - Component for displaying individual file items
