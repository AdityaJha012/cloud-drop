import React from 'react';
import { Upload } from 'lucide-react';
import FileItemComponent from './FileItem';
import { FileItem } from './types';

interface FileListProps {
  files: FileItem[];
  onRemove: (id: string) => void;
  onUpload: () => void;
  isUploading: boolean;
}

export const FileList: React.FC<FileListProps> = ({ 
  files, 
  onRemove, 
  onUpload, 
  isUploading 
}) => {
  if (files.length === 0) return null;
  
  const pendingFiles = files.filter(f => f.status === 'idle').length;
  const successFiles = files.filter(f => f.status === 'success').length;
  const errorFiles = files.filter(f => f.status === 'error').length;
  const uploadingFiles = files.filter(f => f.status === 'uploading').length;

  return (
    <div className="mt-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Files ({files.length})
            </h3>
            <div className="flex gap-3 text-xs mt-1">
              {pendingFiles > 0 && (
                <span className="text-gray-500 dark:text-gray-400">
                  {pendingFiles} pending
                </span>
              )}
              {uploadingFiles > 0 && (
                <span className="text-blue-500">
                  {uploadingFiles} uploading
                </span>
              )}
              {successFiles > 0 && (
                <span className="text-green-500">
                  {successFiles} complete
                </span>
              )}
              {errorFiles > 0 && (
                <span className="text-red-500">
                  {errorFiles} failed
                </span>
              )}
            </div>
          </div>
          
          {pendingFiles > 0 && (
            <button
              onClick={onUpload}
              disabled={isUploading}
              className={`
                px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-sm
                ${isUploading
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow'}
              `}
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload All
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {files.map((file) => (
            <div key={file.id} className="p-3">
              <FileItemComponent 
                file={file} 
                onRemove={onRemove} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileList;
