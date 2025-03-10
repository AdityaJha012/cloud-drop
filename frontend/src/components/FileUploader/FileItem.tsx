import React, { useState, useEffect, useRef } from 'react';
import { Image, File as FileIcon, CheckCircle, AlertCircle, Loader2, Trash2, FileText, FileAudio, FileVideo, Film, Eye } from 'lucide-react';
import { FileItem } from './types';

// First, let's add a simple modal component
const PreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

interface FileItemProps {
  file: FileItem;
  onRemove: (id: string) => void;
}

export const FileItemComponent: React.FC<FileItemProps> = ({ file, onRemove }) => {
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For text files, create a text preview
    if (file.file.type.startsWith('text/') && !textPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setTextPreview(e.target.result as string);
        }
      };
      reader.readAsText(file.file);
    }
  }, [file, textPreview]);

  // Get appropriate icon based on file type
  const getFileIcon = () => {
    if (file.file.type.startsWith('image/')) {
      return <Image className="w-6 h-6 text-blue-500" />;
    } else if (file.file.type.startsWith('video/')) {
      return <FileVideo className="w-6 h-6 text-purple-500" />;
    } else if (file.file.type.startsWith('audio/')) {
      return <FileAudio className="w-6 h-6 text-yellow-500" />;
    } else if (file.file.type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (file.file.type.startsWith('text/')) {
      return <FileText className="w-6 h-6 text-green-500" />;
    } else if (file.file.type === 'image/gif') {
      return <Film className="w-6 h-6 text-pink-500" />;
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

  // File can be previewed
  const canPreview = () => {
    const fileType = file.file.type;
    return (
      fileType.startsWith('image/') ||
      fileType.startsWith('video/') ||
      fileType.startsWith('audio/') ||
      fileType === 'application/pdf' ||
      fileType.startsWith('text/')
    );
  };

  // Render thumbnail preview
  const renderThumbnail = () => {
    const fileType = file.file.type;
    
    if (fileType.startsWith('image/')) {
      return (
        <img 
          src={file.preview} 
          alt="Preview" 
          className="w-14 h-14 object-cover rounded-lg"
        />
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <div className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg relative overflow-hidden">
          <video 
            src={file.preview} 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <FileVideo className="w-8 h-8 text-white" />
          </div>
        </div>
      );
    } else if (fileType.startsWith('audio/')) {
      return (
        <div className="w-14 h-14 flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <FileAudio className="w-8 h-8 text-yellow-500" />
        </div>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <div className="w-14 h-14 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
          <FileText className="w-8 h-8 text-red-500" />
        </div>
      );
    } else if (fileType.startsWith('text/')) {
      return (
        <div className="w-14 h-14 flex items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-lg overflow-hidden">
          {textPreview ? (
            <div ref={textRef} className="text-xxs p-1 text-gray-600 dark:text-gray-300 overflow-hidden w-full h-full">
              {textPreview.substring(0, 120)}
            </div>
          ) : (
            <FileText className="w-8 h-8 text-green-500" />
          )}
        </div>
      );
    } else {
      return (
        <div className="w-14 h-14 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
          {getFileIcon()}
        </div>
      );
    }
  };

  // Render modal content
  const renderModalContent = () => {
    const fileType = file.file.type;
    
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img 
            src={file.preview} 
            alt={file.file.name}
            className="max-h-[70vh] max-w-full object-contain rounded"
          />
        </div>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <div className="flex justify-center">
          <video 
            src={file.preview} 
            className="max-h-[70vh] max-w-full rounded" 
            controls
            autoPlay
          />
        </div>
      );
    } else if (fileType.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center">
          <FileAudio className="w-16 h-16 text-yellow-500 mb-4" />
          <audio 
            src={file.preview} 
            className="w-full" 
            controls
            autoPlay
          />
        </div>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <iframe 
          src={file.preview} 
          className="w-full h-[70vh] border-0"
          title={file.file.name}
        />
      );
    } else if (fileType.startsWith('text/')) {
      return (
        <div className="bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 w-full overflow-auto max-h-[70vh]">
          <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
            {textPreview}
          </pre>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          {getFileIcon()}
          <p className="mt-4 text-gray-600 dark:text-gray-400">No preview available for this file type</p>
        </div>
      );
    }
  };

  return (
    <>
      <div className={`group relative flex items-center p-4 border rounded-xl shadow-sm hover:shadow transition-all ${getStatusColorClass()}`}>
        {/* Preview Thumbnail */}
        <div 
          className="flex-shrink-0 w-14 h-14 mr-4 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => canPreview() && setShowPreview(true)}
        >
          {renderThumbnail()}
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
        
        {/* Action Buttons */}
        <div className="flex items-center ml-2 space-x-1">
          {/* Preview Button */}
          {canPreview() && (
            <button
              onClick={() => setShowPreview(true)}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Preview file"
              title="Preview"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
          
          {/* Remove Button */}
          <button
            onClick={() => onRemove(file.id)}
            className="p-2 rounded-full text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Remove file"
            title="Remove"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={file.file.name}
      >
        {renderModalContent()}
      </PreviewModal>
    </>
  );
};

export default FileItemComponent;
