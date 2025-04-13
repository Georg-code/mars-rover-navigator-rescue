
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SectionTitle from '@/components/ui/SectionTitle';
import RoverDetectionForm from '@/components/rover/RoverDetectionForm';
import RoverDetectionResult from '@/components/rover/RoverDetectionResult';
import { Radar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyzeImage = (file: File) => {
    setIsProcessing(true);
    toast.info('Analyzing satellite imagery...', { duration: 2000 });
    
    // Simulate processing time
    setTimeout(() => {
      // Mock result data
      const result = {
        probability: Math.floor(Math.random() * 60) + 30, // Random probability between 30-90%
        imageUrl: URL.createObjectURL(file),
        coordinates: {
          latitude: `${(Math.random() * 90).toFixed(4)}°N`,
          longitude: `${(Math.random() * 180).toFixed(4)}°E`,
        },
        timestamp: new Date().toLocaleString(),
        conditionalData: {
          surfaceTemp: `${Math.floor(Math.random() * 30) - 60}°C`,
          lightLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
          terrainType: ['Rocky', 'Sandy', 'Crater', 'Dune Field'][Math.floor(Math.random() * 4)],
          confidence: Math.floor(Math.random() * 25) + 70, // Confidence between 70-95%
        }
      };
      
      setAnalysisResult(result);
      setIsProcessing(false);
      toast.success('Analysis complete');
    }, 3000);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <SectionTitle 
            title="Rover Detection" 
            subtitle="Upload satellite imagery to detect stranded rovers on Mars" 
            icon={<Radar size={28} />}
          />
          
          <Button variant="outline" size="sm" className="self-start">
            <Info className="h-4 w-4 mr-2" />
            How it works
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <RoverDetectionForm 
            onAnalyze={handleAnalyzeImage} 
            isProcessing={isProcessing}
          />
          
          {analysisResult && (
            <RoverDetectionResult 
              probability={analysisResult.probability}
              imageUrl={analysisResult.imageUrl}
              coordinates={analysisResult.coordinates}
              timestamp={analysisResult.timestamp}
              conditionalData={analysisResult.conditionalData}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
