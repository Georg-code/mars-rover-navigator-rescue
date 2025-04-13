
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SectionTitle from '@/components/ui/SectionTitle';
import ObjectDetectionForm from '@/components/objects/ObjectDetectionForm';
import ObjectDetectionResults from '@/components/objects/ObjectDetectionResults';
import { Search, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ObjectDetection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any>(null);

  const handleAnalyzeImage = (file: File) => {
    setIsProcessing(true);
    toast.info('Analyzing image for objects of interest...', { duration: 3000 });
    
    // Simulate processing time
    setTimeout(() => {
      // Generate random detection results
      const imageUrl = URL.createObjectURL(file);
      
      // Create 3-7 random objects
      const objectCount = Math.floor(Math.random() * 5) + 3;
      const objects = [];
      
      const objectTypes = [
        {
          labels: ['Rocky Formation', 'Cave Entrance', 'Impact Crater', 'Dust Devil', 'Sand Dune'],
          descriptions: [
            'Natural rock formation with unusual stratification patterns',
            'Potential cave entrance, showing signs of shadow depth',
            'Recent impact crater with distinctive ejecta pattern',
            'Active dust devil showing vertical cloud formation',
            'Large sand dune with ripple patterns indicating wind direction'
          ],
          priority: 'low'
        },
        {
          labels: ['Rover Tracks', 'Metal Debris', 'Abandoned Equipment', 'Solar Panel', 'Parachute Fabric'],
          descriptions: [
            'Track patterns consistent with rover wheel design, heading northwest',
            'Metallic debris approximately 0.5m in length, possibly spacecraft component',
            'Equipment resembling scientific instruments, partially buried',
            'Reflective surface consistent with solar panel technology',
            'Fabric material with pattern matching mission parachute design'
          ],
          priority: 'medium'
        },
        {
          labels: ['Water Ice', 'Methane Emission', 'Unusual Coloration', 'Organic Material', 'Heat Signature'],
          descriptions: [
            'Surface reflectivity suggests exposed water ice deposits',
            'Spectral analysis indicates potential methane emission point',
            'Unusual color variation inconsistent with surrounding mineralogy',
            'Patterns consistent with potential microbial mat formation',
            'Thermal anomaly detected, possible geothermal activity'
          ],
          priority: 'high'
        }
      ];
      
      // Canvas dimensions for placing objects randomly
      const canvasWidth = 800;
      const canvasHeight = 600;
      
      for (let i = 0; i < objectCount; i++) {
        // Select random object type
        const typeIndex = Math.floor(Math.random() * objectTypes.length);
        const type = objectTypes[typeIndex];
        
        // Select random label and description from the type
        const labelIndex = Math.floor(Math.random() * type.labels.length);
        
        // Random size between 50 and 150 pixels
        const width = Math.floor(Math.random() * 100) + 50;
        const height = Math.floor(Math.random() * 100) + 50;
        
        // Random position, ensuring object is fully within canvas
        const x = Math.floor(Math.random() * (canvasWidth - width));
        const y = Math.floor(Math.random() * (canvasHeight - height));
        
        objects.push({
          id: `obj-${i}`,
          label: type.labels[labelIndex],
          confidence: Math.random() * 0.3 + 0.65, // 65-95% confidence
          coordinates: {
            x,
            y,
            width,
            height
          },
          description: type.descriptions[labelIndex],
          priority: type.priority
        });
      }
      
      setDetectionResults({
        imageUrl,
        detectedObjects: objects
      });
      
      setIsProcessing(false);
      toast.success(`${objects.length} objects detected`);
    }, 4000);
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
          <SectionTitle 
            title="Object Detection" 
            subtitle="Identify objects of interest on the Martian surface" 
            icon={<Search size={28} />}
          />
          
          <Button variant="outline" size="sm" className="self-start">
            <Info className="h-4 w-4 mr-2" />
            How it works
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <ObjectDetectionForm 
            onAnalyze={handleAnalyzeImage} 
            isProcessing={isProcessing}
          />
          
          {detectionResults && (
            <ObjectDetectionResults 
              imageUrl={detectionResults.imageUrl}
              detectedObjects={detectionResults.detectedObjects}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ObjectDetection;
