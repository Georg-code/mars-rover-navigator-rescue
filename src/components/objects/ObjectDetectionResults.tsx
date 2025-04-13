
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Eye, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface ObjectDetectionResultsProps {
  imageUrl: string;
  detectedObjects: DetectedObject[];
}

const ObjectDetectionResults = ({ imageUrl, detectedObjects }: ObjectDetectionResultsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [selectedObject, setSelectedObject] = useState<DetectedObject | null>(null);

  // Draw the image and detection boxes
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Apply Mars-like filter
      ctx.fillStyle = 'rgba(226, 123, 88, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw detection boxes
      detectedObjects.forEach(obj => {
        drawDetectionBox(ctx, obj);
      });
    };
  }, [imageUrl, detectedObjects, selectedObject]);

  const drawDetectionBox = (ctx: CanvasRenderingContext2D, obj: DetectedObject) => {
    const { x, y, width, height } = obj.coordinates;
    const isSelected = selectedObject?.id === obj.id;
    
    // Set box style based on priority and selection
    let color = '';
    switch (obj.priority) {
      case 'high':
        color = isSelected ? '#ff3333' : '#ff6666';
        break;
      case 'medium':
        color = isSelected ? '#ffcc00' : '#ffdd44';
        break;
      case 'low':
        color = isSelected ? '#33cc33' : '#66dd66';
        break;
    }
    
    // Draw box
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.strokeStyle = color;
    ctx.setLineDash(isSelected ? [] : [5, 3]);
    ctx.strokeRect(x, y, width, height);
    
    // Draw label background
    ctx.fillStyle = isSelected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)';
    const label = `${obj.label} (${Math.round(obj.confidence * 100)}%)`;
    const labelWidth = ctx.measureText(label).width + 10;
    const labelHeight = 24;
    ctx.fillRect(x, y - labelHeight, labelWidth, labelHeight);
    
    // Draw label text
    ctx.fillStyle = color;
    ctx.font = isSelected ? 'bold 12px Arial' : '12px Arial';
    ctx.fillText(label, x + 5, y - 8);
    
    // Draw selection indicator
    if (isSelected) {
      // Draw corner indicators
      const cornerSize = 6;
      ctx.fillStyle = color;
      
      // Top-left corner
      ctx.fillRect(x - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
      // Top-right corner
      ctx.fillRect(x + width - cornerSize / 2, y - cornerSize / 2, cornerSize, cornerSize);
      // Bottom-left corner
      ctx.fillRect(x - cornerSize / 2, y + height - cornerSize / 2, cornerSize, cornerSize);
      // Bottom-right corner
      ctx.fillRect(x + width - cornerSize / 2, y + height - cornerSize / 2, cornerSize, cornerSize);
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX / scale;
    const y = (e.clientY - rect.top) * scaleY / scale;
    
    // Check if click is inside any detection box
    let clickedObject = null;
    for (const obj of detectedObjects) {
      const { x: objX, y: objY, width, height } = obj.coordinates;
      if (x >= objX && x <= objX + width && y >= objY && y <= objY + height) {
        clickedObject = obj;
        break;
      }
    }
    
    setSelectedObject(clickedObject);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'mars-object-detection.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Image downloaded successfully');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border border-mars-dark/30 bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b border-mars-dark/30 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Detection Results</h3>
              <p className="text-sm text-gray-400">
                {detectedObjects.length} object{detectedObjects.length !== 1 ? 's' : ''} detected
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-300">
                {Math.round(scale * 100)}%
              </span>
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2 overflow-auto bg-black/20 flex items-center justify-center p-4">
              <div 
                style={{ 
                  transform: `scale(${scale})`, 
                  transformOrigin: 'top left',
                  maxHeight: '600px',
                  overflowY: 'auto'
                }}
              >
                <canvas 
                  ref={canvasRef} 
                  onClick={handleCanvasClick}
                  className="border border-mars-dark/40 shadow-lg cursor-crosshair"
                />
              </div>
            </div>
            
            <div className="border-t md:border-t-0 md:border-l border-mars-dark/30 p-4">
              <h4 className="text-md font-medium mb-3 flex items-center gap-1">
                <Eye className="h-4 w-4 text-mars" />
                Detected Objects
              </h4>
              
              <div className="space-y-2 mb-6">
                {detectedObjects.map(obj => (
                  <div 
                    key={obj.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedObject?.id === obj.id 
                        ? 'bg-mars/30 border border-mars' 
                        : 'bg-muted/30 hover:bg-muted/50 border border-mars-dark/20'
                    }`}
                    onClick={() => setSelectedObject(obj)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${
                          obj.priority === 'high' ? 'bg-red-500' : 
                          obj.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        {obj.label}
                      </div>
                      <div className="text-xs bg-muted/50 px-2 py-0.5 rounded">
                        {Math.round(obj.confidence * 100)}%
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{obj.description}</p>
                  </div>
                ))}
              </div>
              
              {selectedObject && (
                <div className="p-3 border border-mars-dark/30 bg-muted/30 rounded-md">
                  <h5 className="font-medium text-sm mb-2">{selectedObject.label} Details</h5>
                  <p className="text-xs text-gray-300 mb-2">{selectedObject.description}</p>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <AlertCircle className="h-3.5 w-3.5 text-mars" />
                    <span>
                      {selectedObject.priority === 'high' ? 'High priority' : 
                       selectedObject.priority === 'medium' ? 'Medium priority' : 'Low priority'} object
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Import the useState to make this component work
import { useState } from 'react';

export default ObjectDetectionResults;
