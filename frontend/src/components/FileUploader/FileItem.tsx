import React from 'react';
import { Image, File as FileIcon, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { FileItem } from './types';

interface FileItemProps {
  file: FileItem;
  onRemove: (id: string) => void;
}

export const FileItemComponent: React.FC<FileItemProps> = ({ file, onRemove }) => {
  // Get appropriate icon based on file type
  const getFileIcon = () => {
    if (file.file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    }
    return <FileIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />;
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (file.status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get status color class
  const getStatusColorClass = () => {
    switch (file.status) {
      case 'uploading': return 'border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10';
      case 'success': return 'border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10';
      case 'error': return 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10';
      default: return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    }
  };

  return (
    <div className={`group flex items-center p-4 border rounded-xl shadow-sm hover:shadow transition-all ${getStatusColorClass()}`}>
      {/* Preview or Icon */}
      <div className="flex-shrink-0 w-14 h-14 mr-4 rounded-lg overflow-hidden">
        {file.preview ? (
          <img 
            src={file.preview} 
            alt="Preview" 
            className="w-14 h-14 object-cover"
          />
        ) : (
          <div className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getFileIcon()}
          </div>
        )}
      </div>
      
      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
          {getStatusIcon()}
          <span>{formatFileSize(file.file.size)}</span>
          
          {file.status === 'success' && (
            <span className="text-xs font-medium text-green-500 ml-1">
              Complete
            </span>
          )}
          
          {file.status === 'error' && (
            <span className="text-xs font-medium text-red-500 ml-1">
              {file.error || 'Error'}
            </span>
          )}
        </p>
      </div>
      
      {/* Progress Bar */}
      {file.status === 'uploading' && (
        <div className="ml-4 w-24 flex-shrink-0">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 w-8">
              {file.progress}%
            </span>
          </div>
        </div>
      )}
      
      {/* Remove Button */}
      <button
        onClick={() => onRemove(file.id)}
        className="ml-3 p-2 rounded-full text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Remove file"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default FileItemComponent;
