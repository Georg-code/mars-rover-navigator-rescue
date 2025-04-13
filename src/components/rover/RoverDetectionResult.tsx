
import React from 'react';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Radar, MapPin, Clock, Thermometer } from 'lucide-react';

interface RoverDetectionResultProps {
  probability: number;
  imageUrl: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
  timestamp: string;
  conditionalData: {
    surfaceTemp: string;
    lightLevel: string;
    terrainType: string;
    confidence: number;
  };
}

const RoverDetectionResult = ({
  probability,
  imageUrl,
  coordinates,
  timestamp,
  conditionalData,
}: RoverDetectionResultProps) => {
  const getResultStatus = () => {
    if (probability > 75) return 'High Probability';
    if (probability > 40) return 'Medium Probability';
    return 'Low Probability';
  };

  const getStatusColor = () => {
    if (probability > 75) return 'success';
    if (probability > 40) return 'warning';
    return 'offline';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="bg-card border-mars-dark/30 overflow-hidden">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Mars Surface" 
            className="w-full h-auto max-h-[300px] object-cover satellite-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusBadge status={getStatusColor() as any} />
                <span className="text-white font-medium">{getResultStatus()}</span>
              </div>
              <div className="bg-black/50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Detection Results</h3>
              
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Rover Presence Probability</p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-mars">{probability}%</div>
                  <div className="flex-1">
                    <ProgressBar 
                      value={probability} 
                      max={100} 
                      size="lg"
                      color={probability > 75 ? 'success' : probability > 40 ? 'warning' : 'primary'}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-4 w-4 text-mars" />
                    <span className="text-sm font-medium">Coordinates</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {coordinates.latitude}, {coordinates.longitude}
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer className="h-4 w-4 text-mars" />
                    <span className="text-sm font-medium">Surface Temp</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {conditionalData.surfaceTemp}
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Radar className="h-4 w-4 text-mars" />
                    <span className="text-sm font-medium">Terrain Type</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {conditionalData.terrainType}
                  </div>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-mars" />
                    <span className="text-sm font-medium">Light Level</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    {conditionalData.lightLevel}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-64 flex-shrink-0 bg-muted/30 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Analysis Confidence</h4>
              <ProgressBar 
                value={conditionalData.confidence} 
                max={100} 
                label="Model Confidence"
                showPercentage 
                className="mb-4"
              />
              
              <div className="text-xs text-gray-400 leading-relaxed">
                <p className="mb-2">
                  These results indicate {probability > 60 ? 'a strong' : 'some'} evidence of rover presence 
                  in the analyzed region. {probability > 75 ? 'Immediate rescue operation is recommended.' : 
                  probability > 40 ? 'Consider further analysis or a rescue operation.' : 
                  'Additional imagery may be required before rescue operations.'}
                </p>
                <p>
                  Detection algorithm: MarsScanV3
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoverDetectionResult;
