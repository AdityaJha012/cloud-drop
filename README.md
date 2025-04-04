# 🚀 CloudDrop - File Upload Application

A modern file upload application with drag-and-drop functionality, camera integration, and real-time progress tracking.

## ✨ Features

- 🔑 User authentication with JWT
- 📂 Drag-and-drop file uploads
- 📸 Direct camera capture
- 🚀 Real-time upload progress tracking
- 🌗 Dark/light mode support
- 🖼️ File previews
- ☁️ MinIO storage backend
- 🗂️ MongoDB metadata storage

## 📁 Project Structure

- **Frontend**: ⚛️ React with TypeScript and Tailwind CSS
- **Backend**: ⚡ Fastify with TypeScript
- **Storage**: ☁️ MinIO for file storage
- **Database**: 🗄️ MongoDB for metadata storage
- **ORM**: 🔄 Drizzle for database operations

## 🛠️ Setup Instructions

### 📌 Prerequisites

- 🟢 Node.js (v14 or higher)
- 📦 MinIO and MongoDB installed manually

### 🚀 Installing and Running the Backend

```bash
cd backend
pnpm install
pnpm run dev
```

The backend will start on [http://localhost:3000](http://localhost:3000).

### 🎨 Installing and Running the Frontend

```bash
cd frontend
pnpm install
pnpm start
```

The frontend will start on [http://localhost:5173](http://localhost:5173).

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=3000
HOST=0.0.0.0

# MongoDB Configuration
MONGODB_URI=mongodb://root:password@localhost:27017/cloud-drop?authSource=admin
MONGODB_DB_NAME=cloud-drop

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=cloud-drop

# Authentication
SECRET_KEY=your_secret_key_here
```

## 🔗 API Endpoints

- `POST /api/auth/register` - 📝 Register a new user
- `POST /api/auth/login` - 🔑 User login
- `POST /api/files/upload` - 📤 Upload a file
- `GET /api/files` - 📂 Get all user files
- `DELETE /api/files/:id` - 🗑️ Delete a file

## 🏗️ Frontend Components

- `📤 FileUploader` - Main component for drag-and-drop uploads
- `📸 CameraCapture` - Component for capturing photos
- `📂 FileList` - Component for displaying uploaded files
- `🖼️ FileItem` - Component for displaying individual file items
- `🔑 Auth` - Component for user authentication (login/register)
