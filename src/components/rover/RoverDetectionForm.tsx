
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, UploadCloud, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RoverDetectionFormProps {
  onAnalyze: (file: File) => void;
  isProcessing: boolean;
}

const RoverDetectionForm = ({ onAnalyze, isProcessing }: RoverDetectionFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    // Check file type
    if (!selectedFile.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }
    
    setFile(selectedFile);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onAnalyze(file);
    } else {
      toast.error('Please upload an image to analyze');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div 
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-all',
          dragActive ? 'border-mars bg-mars/10' : 'border-gray-600',
          isProcessing && 'opacity-60 pointer-events-none'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!previewUrl ? (
          <div className="flex flex-col items-center justify-center py-8">
            <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop satellite imagery</p>
            <p className="text-sm text-gray-400 mb-6 text-center max-w-md">
              Upload high-resolution Mars satellite imagery to detect rover presence probability
            </p>
            <Button
              type="button"
              className="bg-mars hover:bg-mars-dark text-white"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Select image
            </Button>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleChange}
              accept="image/*"
              disabled={isProcessing}
            />
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={removeFile}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors z-10"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative rounded-md overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto max-h-[400px] object-cover rounded satellite-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{file?.name}</p>
                <p className="text-xs text-gray-400">
                  {(file?.size ? (file.size / 1024 / 1024).toFixed(2) : '0')} MB
                </p>
              </div>
              <Button 
                type="submit" 
                className="bg-mars hover:bg-mars-dark text-white"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Analyze Image'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <Card className="bg-muted/40 border-mars-dark/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                <li>Images should be high-resolution satellite imagery</li>
                <li>Best results with images taken during daylight hours on Mars</li>
                <li>Detection accuracy is approximately 87% in optimal conditions</li>
                <li>Processing may take up to 30 seconds for large images</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </form>
  );
};

export default RoverDetectionForm;
