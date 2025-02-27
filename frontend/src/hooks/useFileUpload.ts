import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface FileItem {
  id: string;
  file: File;
  preview?: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

// API Base URL
const API_URL = 'http://localhost:3000/api/files';

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Add files to the list
  const addFiles = useCallback((newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map((file) => ({
      id: uuidv4(),
      file,
      status: 'idle',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    }));

    setFiles((prev) => [...prev, ...fileItems]);
  }, []);

  // Remove a file from the list
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((file) => file.id !== id);
      
      // Revoke object URL to avoid memory leaks
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      return updatedFiles;
    });
  }, []);

  // Update a file's status and progress
  const updateFileStatus = useCallback((id: string, updates: Partial<FileItem>) => {
    setFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, ...updates } : file))
    );
  }, []);

  // Upload a single file
  const uploadFile = useCallback(async (fileItem: FileItem) => {
    try {
      // Mark file as uploading
      updateFileStatus(fileItem.id, { status: 'uploading', progress: 0 });

      // Create FormData
      const formData = new FormData();
      formData.append('file', fileItem.file);

      // Create XHR to track progress
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/upload`, true);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          updateFileStatus(fileItem.id, { progress });
        }
      };

      // Handle response
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          updateFileStatus(fileItem.id, {
            status: 'success',
            progress: 100,
            url: response.file.url,
          });
        } else {
          updateFileStatus(fileItem.id, {
            status: 'error',
            error: `Upload failed: ${xhr.statusText}`,
          });
        }
      };

      // Handle error
      xhr.onerror = () => {
        updateFileStatus(fileItem.id, {
          status: 'error',
          error: 'Network error occurred',
        });
      };

      // Send the request
      xhr.send(formData);

    } catch (error) {
      updateFileStatus(fileItem.id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [updateFileStatus]);

  // Upload all pending files
  const uploadFiles = useCallback(async () => {
    const pendingFiles = files.filter((file) => file.status === 'idle');
    
    if (pendingFiles.length === 0) return;
    
    setIsUploading(true);
    
    // Upload files in parallel
    await Promise.all(pendingFiles.map((file) => uploadFile(file)));
    
    setIsUploading(false);
  }, [files, uploadFile]);

  return {
    files,
    addFiles,
    removeFile,
    uploadFiles,
    isUploading,
    clearFiles: () => setFiles([]),
    clearCompleted: () => setFiles(files.filter(f => f.status !== 'success')),
  };
};
