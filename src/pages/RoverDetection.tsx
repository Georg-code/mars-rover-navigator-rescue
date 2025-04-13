
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SectionTitle from '@/components/ui/SectionTitle';
import RoverDetectionForm from '@/components/rover/RoverDetectionForm';
import RoverDetectionResult from '@/components/rover/RoverDetectionResult';
import { Search, InfoCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DataCard from '@/components/ui/DataCard';

const RoverDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any>(null);

  const handleAnalyzeImage = async (file: File) => {
    setIsProcessing(true);
    toast.info('Analyzing image for rover presence...', { duration: 3000 });
    
    try {
      // Create a FormData object to send the image
      const formData = new FormData();
      formData.append('image', file);
      
      // Call the rover detection API
      const response = await fetch('/detect-rover/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Get the probability as a string from the API
      const probabilityString = await response.text();
      const probability = parseFloat(probabilityString);
      
      if (isNaN(probability)) {
        throw new Error('Invalid probability value received from API');
      }
      
      // Create the result object with the probability and image data
      const imageUrl = URL.createObjectURL(file);
      
      // Generate random coordinates for demonstration
      const latitude = ((Math.random() * 20) - 10).toFixed(4);
      const longitude = ((Math.random() * 40) - 20).toFixed(4);
      
      // Determine terrain type based on probability ranges
      let terrainType = "Rocky Plains";
      if (probability > 75) terrainType = "Ancient Riverbed";
      else if (probability > 40) terrainType = "Crater Basin";
      
      const results = {
        probability: probability,
        imageUrl: imageUrl,
        coordinates: {
          latitude: `${latitude}° N`,
          longitude: `${longitude}° E`,
        },
        timestamp: new Date().toLocaleString(),
        conditionalData: {
          surfaceTemp: `${Math.floor(Math.random() * 60) - 40}°C`,
          lightLevel: probability > 50 ? "Daylight" : "Low Light",
          terrainType: terrainType,
          confidence: Math.min(95, probability + Math.floor(Math.random() * 10)),
        }
      };
      
      setDetectionResults(results);
    } catch (error) {
      console.error("Error detecting rover:", error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <SectionTitle 
            title="Rover Detection" 
            subtitle="Locate stranded rovers on the Martian surface" 
            icon={<Search size={28} />}
          />
          
          <Button variant="outline" size="sm" className="self-start">
            <InfoCircle className="h-4 w-4 mr-2" />
            How it works
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          {!detectionResults ? (
            <DataCard title="Upload Imagery" icon={<Search size={16} />}>
              <RoverDetectionForm 
                onAnalyze={handleAnalyzeImage} 
                isProcessing={isProcessing}
              />
            </DataCard>
          ) : (
            <RoverDetectionResult 
              probability={detectionResults.probability}
              imageUrl={detectionResults.imageUrl}
              coordinates={detectionResults.coordinates}
              timestamp={detectionResults.timestamp}
              conditionalData={detectionResults.conditionalData}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default RoverDetection;
