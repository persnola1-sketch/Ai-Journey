import { useState, useRef } from 'react';
import { Upload, Camera, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const ReceiptUpload = ({ onScanComplete, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Compress image to reduce payload size
  const compressImage = (file, maxSizeMB = 1) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions to keep under maxSizeMB
          const maxDimension = 1920; // max width or height
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with quality 0.8
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            'image/jpeg',
            0.8
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG)');
      if (onError) onError('Invalid file type');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image is too large. Maximum size is 5MB');
      if (onError) onError('File too large');
      return;
    }

    // Compress image before processing
    try {
      const compressedFile = await compressImage(file);
      console.log('Original size:', (file.size / 1024).toFixed(2), 'KB');
      console.log('Compressed size:', (compressedFile.size / 1024).toFixed(2), 'KB');
      
      // Create preview with compressed file
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        scanReceipt(e.target.result);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Compression error:', error);
      toast.error('Failed to process image');
      if (onError) onError('Compression failed');
    }
  };

  const scanReceipt = async (base64Image) => {
    setIsScanning(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/scan-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan receipt');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success('Receipt scanned successfully!');
        if (onScanComplete) onScanComplete(result.data);
      } else {
        throw new Error('Scan failed');
      }

    } catch (error) {
      console.error('Receipt scan error:', error);
      toast.error(error.message || 'Failed to scan receipt. Please try again.');
      if (onError) onError(error.message);
      setPreview(null);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraCapture = () => {
    // Trigger file input with camera mode
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleChooseFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900'
            : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950'
        } ${isScanning ? 'pointer-events-none opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isScanning ? (
          <div className="flex flex-col items-center space-y-3">
            <Loader className="w-12 h-12 text-neutral-400 dark:text-neutral-500 animate-spin" />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Scanning receipt...
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">
              This may take a few seconds
            </p>
          </div>
        ) : preview ? (
          <div className="space-y-3">
            <img 
              src={preview} 
              alt="Receipt preview" 
              className="max-h-48 mx-auto rounded border border-neutral-200 dark:border-neutral-800"
            />
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Processing...
            </p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-3" />
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Drop receipt here
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              or click buttons below to upload
            </p>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!isScanning && !preview && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCameraCapture}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm font-medium">Take Photo</span>
          </button>
          <button
            onClick={handleChooseFile}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Choose File</span>
          </button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-3">
        <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Tips for best results:
        </p>
        <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
          <li>• Ensure receipt is well-lit and in focus</li>
          <li>• Include the entire receipt in the photo</li>
          <li>• Avoid shadows and glare</li>
          <li>• Supported formats: JPG, PNG (max 5MB)</li>
        </ul>
      </div>
    </div>
  );
};

export default ReceiptUpload;

