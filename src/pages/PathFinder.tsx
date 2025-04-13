
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SectionTitle from '@/components/ui/SectionTitle';
import MarsMap from '@/components/pathfinding/MarsMap';
import PathDetails from '@/components/pathfinding/PathDetails';
import { MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Coordinate {
  x: number;
  y: number;
}

const PathFinder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [path, setPath] = useState<Coordinate[] | null>(null);
  const [pathMetrics, setPathMetrics] = useState<any>(null);

  const handlePathFind = (start: Coordinate, end: Coordinate) => {
    setIsProcessing(true);
    toast.info('Calculating optimal path...', { duration: 2000 });
    
    // Simulate processing time
    setTimeout(() => {
      // Generate a path with multiple points between start and end
      const pathPoints: Coordinate[] = [start];
      
      const steps = Math.floor(Math.random() * 5) + 8; // 8-12 points
      for (let i = 1; i < steps - 1; i++) {
        const ratio = i / (steps - 1);
        
        // Create a slightly curved path with some randomness
        const midX = start.x + (end.x - start.x) * ratio;
        const midY = start.y + (end.y - start.y) * ratio;
        
        // Add some randomness to make the path look more natural
        const randomX = (Math.random() * 50) - 25;
        const randomY = (Math.random() * 50) - 25;
        
        pathPoints.push({
          x: midX + randomX,
          y: midY + randomY
        });
      }
      
      pathPoints.push(end);
      
      // Calculate Euclidean distance
      const distance = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      
      // Mock path metrics
      const metrics = {
        distance: `${(distance / 20).toFixed(1)} km`,
        estimatedTime: `${Math.floor(distance / 80) + 1} hours, ${Math.floor(Math.random() * 60)} minutes`,
        terrainDifficulty: Math.floor(Math.random() * 80) + 10, // 10-90
        environmentalRisk: Math.floor(Math.random() * 60) + 10, // 10-70
        weatherConditions: ['Clear', 'Dusty', 'Light Dust Storm', 'Windy'][Math.floor(Math.random() * 4)],
        temperature: `${Math.floor(Math.random() * 30) - 60}°C`,
        windSpeed: `${Math.floor(Math.random() * 50) + 10} km/h`,
        visibility: ['Low', 'Moderate', 'Good', 'Excellent'][Math.floor(Math.random() * 4)]
      };
      
      setPath(pathPoints);
      setPathMetrics(metrics);
      setIsProcessing(false);
      toast.success('Path calculation complete');
    }, 2500);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <SectionTitle 
            title="Mars Path Planning" 
            subtitle="Calculate and visualize optimal paths between locations on Mars" 
            icon={<MapPin size={28} />}
          />
          
          <Button variant="outline" size="sm" className="self-start">
            <Info className="h-4 w-4 mr-2" />
            How it works
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <MarsMap 
            onPathFind={handlePathFind} 
            path={path}
            isProcessing={isProcessing}
          />
          
          {path && pathMetrics && (
            <PathDetails path={path} pathMetrics={pathMetrics} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PathFinder;
