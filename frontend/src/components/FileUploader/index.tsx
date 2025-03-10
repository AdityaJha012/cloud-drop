import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, FileUp, ImageIcon, CloudUpload } from 'lucide-react';
import CameraCapture from './CameraCapture';
import FileList from './FileList';
import { useFileUpload } from '../../hooks/useFileUpload';

export const FileUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { files, addFiles, removeFile, removeFiles, uploadFiles, isUploading } = useFileUpload();

  // Handle file drops
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragging(false);
    addFiles(acceptedFiles);
  }, [addFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  // Handle camera capture
  const handleCapture = (file: File) => {
    addFiles([file]);
  };

  return (
    <>
      <div className="w-full max-w-3xl mx-auto">
        <div 
          {...getRootProps()} 
          className={`
            relative overflow-hidden rounded-2xl p-8 transition-all text-center cursor-pointer
            ${isDragging 
              ? 'bg-blue-50 dark:bg-blue-900/20 shadow-lg' 
              : 'bg-white dark:bg-gray-800/80 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg'}
            backdrop-blur-sm border border-gray-100 dark:border-gray-700
          `}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -ml-16 -mb-16 bg-gradient-to-tr from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 rounded-full opacity-70"></div>
          
          <input {...getInputProps()} ref={fileInputRef} />
          
          <div className="relative p-6">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600 flex items-center justify-center mb-6 shadow-lg transform transition-transform hover:scale-105">
              <CloudUpload className="w-12 h-12 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Drop files to upload
            </h3>
            
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Drag & drop your files here, or use the buttons below to upload files or take photos directly.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (fileInputRef.current) fileInputRef.current.click();
                }}
                className="px-5 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow flex items-center gap-2 font-medium"
              >
                <FileUp className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Select Files
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCapturing(true);
                }}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <Camera className="w-5 h-5" /> Take Photo
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 relative">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Images
            </div>
            <div className="flex items-center gap-2">
              <FileUp className="w-4 h-4 text-green-500 dark:text-green-400" /> Documents
            </div>
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-500 dark:text-purple-400" /> And more
            </div>
          </div>
        </div>

        {/* File List */}
        <FileList 
          files={files} 
          onRemove={removeFile} 
          onRemoveAll={removeFiles}
          onUpload={uploadFiles} 
          isUploading={isUploading}
        />
      </div>

      {/* Camera Component */}
      {isCapturing && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setIsCapturing(false)}
        />
      )}
    </>
  );
};

export default FileUploader;
