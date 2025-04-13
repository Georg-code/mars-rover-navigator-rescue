
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, UploadCloud, X, FileImage } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ObjectDetectionFormProps {
  onAnalyze: (file: File) => void;
  isProcessing: boolean;
}

const ObjectDetectionForm = ({ onAnalyze, isProcessing }: ObjectDetectionFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchModes, setSearchModes] = useState<string[]>(['geological', 'artifacts', 'habitat']);

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
    toast.success('Image loaded successfully');
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const toggleSearchMode = (mode: string) => {
    setSearchModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode) 
        : [...prev, mode]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      if (searchModes.length === 0) {
        toast.error('Please select at least one detection category');
        return;
      }
      onAnalyze(file);
    } else {
      toast.error('Please upload an image to analyze');
    }
  };

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid grid-cols-2 w-full mb-4">
        <TabsTrigger value="upload" disabled={isProcessing}>
          <FileImage className="h-4 w-4 mr-2" />
          Upload Image
        </TabsTrigger>
        <TabsTrigger value="settings" disabled={isProcessing}>
          <Search className="h-4 w-4 mr-2" />
          Detection Settings
        </TabsTrigger>
      </TabsList>
      
      <form onSubmit={handleSubmit}>
        <TabsContent value="upload">
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
                <p className="text-lg font-medium mb-2">Drag and drop Mars surface imagery</p>
                <p className="text-sm text-gray-400 mb-6 text-center max-w-md">
                  Upload high-resolution Mars imagery to detect objects of interest
                </p>
                <Button
                  type="button"
                  className="bg-mars hover:bg-mars-dark text-white"
                  onClick={() => document.getElementById('objectFileInput')?.click()}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Select image
                </Button>
                <input
                  id="objectFileInput"
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
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Detection Categories</h3>
            <p className="text-sm text-gray-400 mb-4">
              Select categories of objects to detect in your Mars imagery
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <CategoryButton 
                label="Geological Features" 
                icon={<Mountain className="h-5 w-5" />}
                active={searchModes.includes('geological')}
                onClick={() => toggleSearchMode('geological')}
                disabled={isProcessing}
              />
              
              <CategoryButton 
                label="Artifacts & Equipment" 
                icon={<Wrench className="h-5 w-5" />}
                active={searchModes.includes('artifacts')}
                onClick={() => toggleSearchMode('artifacts')}
                disabled={isProcessing}
              />
              
              <CategoryButton 
                label="Potential Habitats" 
                icon={<Home className="h-5 w-5" />}
                active={searchModes.includes('habitat')}
                onClick={() => toggleSearchMode('habitat')}
                disabled={isProcessing}
              />
              
              <CategoryButton 
                label="Water Indicators" 
                icon={<Droplet className="h-5 w-5" />}
                active={searchModes.includes('water')}
                onClick={() => toggleSearchMode('water')}
                disabled={isProcessing}
              />
              
              <CategoryButton 
                label="Signs of Life" 
                icon={<Sprout className="h-5 w-5" />}
                active={searchModes.includes('life')}
                onClick={() => toggleSearchMode('life')}
                disabled={isProcessing}
              />
              
              <CategoryButton 
                label="Landing Sites" 
                icon={<Target className="h-5 w-5" />}
                active={searchModes.includes('landing')}
                onClick={() => toggleSearchMode('landing')}
                disabled={isProcessing}
              />
            </div>
            
            <div className="text-sm text-gray-400">
              <p className="mb-2">Detection precision settings:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Model: DeepMars v4.2 Neural Network</li>
                <li>Confidence threshold: 65%</li>
                <li>Resolution: Native image resolution</li>
                <li>Analysis depth: Full spectrum + infrared</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <div className="mt-4 flex justify-end">
          <Button 
            type="submit" 
            className="bg-mars hover:bg-mars-dark text-white"
            disabled={isProcessing || !file}
          >
            {isProcessing ? 'Processing...' : 'Analyze for Objects'}
          </Button>
        </div>
      </form>
    </Tabs>
  );
};

// Import additional icons
import { Mountain, Wrench, Home, Droplet, Sprout, Target } from 'lucide-react';

interface CategoryButtonProps {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const CategoryButton = ({ label, icon, active, onClick, disabled }: CategoryButtonProps) => {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 p-3 rounded-md transition-all',
        active ? 'bg-mars/30 border border-mars' : 'bg-muted/30 border border-gray-600',
        'hover:bg-mars/20 hover:border-mars-light',
        disabled && 'opacity-60 pointer-events-none'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={cn(
        'p-1.5 rounded-md',
        active ? 'bg-mars text-white' : 'bg-muted text-gray-400'
      )}>
        {icon}
      </div>
      <span className={active ? 'font-medium text-white' : 'text-gray-300'}>
        {label}
      </span>
    </button>
  );
};

export default ObjectDetectionForm;
