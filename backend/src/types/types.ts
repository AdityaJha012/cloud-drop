import { ObjectId } from "mongodb";

export interface FileMetadata {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  bucket: string;
  path: string;
  uploadedBy: ObjectId;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  metadata: FileMetadata;
  url: string;
}

export interface FileFilter {
  id?: string;
  filename?: string;
  mimeType?: string;
  uploadedBy?: ObjectId,
  uploadedAt?: {
    from?: Date;
    to?: Date;
  };
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface FileQueryString {
  page?: number;
  limit?: number;
  id?: string;
  filename?: string;
  mimeType?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FileListResult {
  files: UploadedFile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
