import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Compress, Image as ImageIcon } from 'lucide-react';
import ProgressLoader from './ProgressLoader';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeKB?: number;
  acceptedTypes?: string[];
  compressionQuality?: number;
  showCompressionMeter?: boolean;
}

interface CompressionProgress {
  originalSize: number;
  compressedSize: number;
  progress: number;
  filename: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  maxSizeKB = 2048,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  compressionQuality = 0.8,
  showCompressionMeter = true
}) => {
  const [compressionProgress, setCompressionProgress] = useState<CompressionProgress[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback((file: File): Promise<{ blob: Blob; progress: CompressionProgress }> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const progress: CompressionProgress = {
              originalSize: file.size,
              compressedSize: blob.size,
              progress: 100,
              filename: file.name
            };
            resolve({ blob, progress });
          }
        }, file.type, compressionQuality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [compressionQuality]);

  const handleFileSelect = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => 
      acceptedTypes.includes(file.type) && file.size <= maxSizeKB * 1024
    );

    if (validFiles.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);

    // Initialize compression progress
    const initialProgress = filesToProcess.map(file => ({
      originalSize: file.size,
      compressedSize: 0,
      progress: 0,
      filename: file.name
    }));
    setCompressionProgress(initialProgress);

    const processedImages: string[] = [];
    const finalProgress: CompressionProgress[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      
      try {
        const { blob, progress } = await compressImage(file);
        const imageUrl = URL.createObjectURL(blob);
        processedImages.push(imageUrl);
        finalProgress.push(progress);
        
        // Update progress
        setCompressionProgress(prev => 
          prev.map((p, index) => 
            index === i ? { ...p, progress: 100, compressedSize: progress.compressedSize } : p
          )
        );
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    onImagesChange([...images, ...processedImages]);
    
    // Clear compression progress after a delay
    setTimeout(() => {
      setCompressionProgress([]);
    }, 2000);
  }, [images, onImagesChange, maxImages, maxSizeKB, acceptedTypes, compressImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const calculateCompressionRatio = (original: number, compressed: number) => {
    if (original === 0) return 0;
    return Math.round(((original - compressed) / original) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-green-400 bg-green-50' 
            : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
          }
          ${images.length >= maxImages ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={`Upload images. ${images.length} of ${maxImages} images uploaded.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          aria-hidden="true"
        />
        
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {images.length >= maxImages 
                ? `Maximum ${maxImages} images reached`
                : 'Add photos to your report'
              }
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Drag & drop or click to upload • Max {formatFileSize(maxSizeKB * 1024)} per image
            </p>
          </div>
        </div>
      </div>

      {/* Compression Progress */}
      {showCompressionMeter && compressionProgress.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Processing Images</h4>
          {compressionProgress.map((progress, index) => (
            <div key={index} className="compression-meter">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 truncate max-w-32">
                  {progress.filename}
                </span>
                <span className="text-xs text-gray-500">
                  {progress.compressedSize > 0 && (
                    <>
                      {formatFileSize(progress.originalSize)} → {formatFileSize(progress.compressedSize)}
                      <span className="ml-1 text-green-600">
                        (-{calculateCompressionRatio(progress.originalSize, progress.compressedSize)}%)
                      </span>
                    </>
                  )}
                </span>
              </div>
              <ProgressLoader
                progress={progress.progress}
                size="sm"
                color="primary"
                showPercentage={false}
                animated={true}
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="
                  absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                  flex items-center justify-center opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200 hover:bg-red-600 focus:opacity-100
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                "
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-1 left-1 right-1">
                <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded text-center">
                  {index + 1} of {maxImages}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{images.length} / {maxImages} images</span>
        <span>Max size: {formatFileSize(maxSizeKB * 1024)}</span>
      </div>
    </div>
  );
};

export default ImageUpload;