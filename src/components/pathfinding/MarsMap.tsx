
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Coordinate {
  x: number;
  y: number;
}

interface MarsMapProps {
  onPathFind: (start: Coordinate, end: Coordinate) => void;
  path: Coordinate[] | null;
  isProcessing: boolean;
}

const MarsMap = ({ onPathFind, path, isProcessing }: MarsMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [startPoint, setStartPoint] = useState<Coordinate | null>(null);
  const [endPoint, setEndPoint] = useState<Coordinate | null>(null);
  const [isPlacingStart, setIsPlacingStart] = useState(false);
  const [isPlacingEnd, setIsPlacingEnd] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load Mars map image
  useEffect(() => {
    const img = new Image();
    img.src = "https://mars.nasa.gov/system/resources/detail_files/24736_PIA24923_1280.jpg"; // Using a NASA Mars map image
    img.onload = () => {
      setMapImage(img);
      drawMap();
    };
  }, []);

  // Draw the map, markers and path
  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas || !mapImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map with current scale and offset
    ctx.save();
    ctx.translate(mapOffset.x, mapOffset.y);
    ctx.scale(mapScale, mapScale);
    ctx.drawImage(mapImage, 0, 0, canvas.width / mapScale, canvas.height / mapScale);
    
    // Apply a Mars-like color filter
    ctx.fillStyle = 'rgba(226, 123, 88, 0.2)';
    ctx.fillRect(0, 0, canvas.width / mapScale, canvas.height / mapScale);
    
    // Draw coordinate grid
    drawGrid(ctx, canvas.width / mapScale, canvas.height / mapScale);
    
    // Draw markers
    if (startPoint) {
      drawMarker(ctx, startPoint.x / mapScale, startPoint.y / mapScale, '#4CAF50', 'S');
    }
    
    if (endPoint) {
      drawMarker(ctx, endPoint.x / mapScale, endPoint.y / mapScale, '#f44336', 'E');
    }
    
    // Draw path
    if (path && path.length > 0) {
      drawPath(ctx, path);
    }
    
    ctx.restore();
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawMarker = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
    // Draw pin
    ctx.fillStyle = color;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Draw label
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
  };

  const drawPath = (ctx: CanvasRenderingContext2D, pathPoints: Coordinate[]) => {
    if (pathPoints.length < 2) return;
    
    // Draw path line
    ctx.strokeStyle = 'rgba(255, 255, 100, 0.8)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(pathPoints[0].x / mapScale, pathPoints[0].y / mapScale);
    
    for (let i = 1; i < pathPoints.length; i++) {
      ctx.lineTo(pathPoints[i].x / mapScale, pathPoints[i].y / mapScale);
    }
    
    ctx.stroke();
    
    // Draw path points
    for (let i = 1; i < pathPoints.length - 1; i++) {
      ctx.fillStyle = 'rgba(255, 255, 100, 0.8)';
      ctx.beginPath();
      ctx.arc(pathPoints[i].x / mapScale, pathPoints[i].y / mapScale, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Handle canvas click for placing markers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isProcessing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    // Adjust for current scale and offset
    const adjustedX = (x - mapOffset.x) / mapScale;
    const adjustedY = (y - mapOffset.y) / mapScale;
    
    const clickPoint = { 
      x: adjustedX * mapScale, 
      y: adjustedY * mapScale 
    };
    
    if (isPlacingStart) {
      setStartPoint(clickPoint);
      setIsPlacingStart(false);
      toast.success('Start point placed');
    } else if (isPlacingEnd) {
      setEndPoint(clickPoint);
      setIsPlacingEnd(false);
      toast.success('End point placed');
    }
  };

  // Handle canvas mouse events for panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlacingStart || isPlacingEnd) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const newOffset = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    
    setMapOffset(newOffset);
    drawMap();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setMapScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setMapScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setMapScale(1);
    setMapOffset({ x: 0, y: 0 });
  };

  // Find path between start and end points
  const handleFindPath = () => {
    if (!startPoint || !endPoint) {
      toast.error('Please set both start and end points');
      return;
    }
    
    onPathFind(startPoint, endPoint);
  };

  // Update map when dependencies change
  useEffect(() => {
    drawMap();
  }, [mapImage, startPoint, endPoint, path, mapScale, mapOffset]);

  return (
    <div className="border border-mars-dark/40 rounded-lg overflow-hidden bg-black/30">
      <div className="flex items-center justify-between p-3 border-b border-mars-dark/40">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className={isPlacingStart ? 'bg-green-500/20 text-green-500' : ''}
            onClick={() => {
              setIsPlacingStart(true);
              setIsPlacingEnd(false);
            }}
            disabled={isProcessing}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Start Point
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className={isPlacingEnd ? 'bg-red-500/20 text-red-500' : ''}
            onClick={() => {
              setIsPlacingEnd(true);
              setIsPlacingStart(false);
            }}
            disabled={isProcessing}
          >
            <MapPin className="h-4 w-4 mr-1" />
            End Point
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button size="icon" variant="outline" onClick={handleZoomIn} disabled={isProcessing}>
            <span className="text-lg">+</span>
          </Button>
          <Button size="icon" variant="outline" onClick={handleZoomOut} disabled={isProcessing}>
            <span className="text-lg">-</span>
          </Button>
          <Button size="icon" variant="outline" onClick={handleReset} disabled={isProcessing}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-auto cursor-crosshair"
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {(isPlacingStart || isPlacingEnd) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 px-4 py-2 rounded-full text-sm text-white">
              Click to place {isPlacingStart ? 'start' : 'end'} point
            </div>
          </div>
        )}
        
        {startPoint && endPoint && (
          <div className="absolute bottom-4 right-4">
            <Button 
              onClick={handleFindPath}
              className="bg-mars hover:bg-mars-dark text-white"
              disabled={isProcessing}
            >
              <Navigation className="h-4 w-4 mr-2" />
              {isProcessing ? 'Calculating...' : 'Find Path'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarsMap;
