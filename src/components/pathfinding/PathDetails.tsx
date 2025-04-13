
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Map, Thermometer, Wind, Droplet, TrendingUp, Footprints } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';

interface Coordinate {
  x: number;
  y: number;
}

interface PathDetailsProps {
  path: Coordinate[] | null;
  pathMetrics: {
    distance: string;
    estimatedTime: string;
    terrainDifficulty: number;
    environmentalRisk: number;
    weatherConditions: string;
    temperature: string;
    windSpeed: string;
    visibility: string;
  } | null;
}

const PathDetails = ({ path, pathMetrics }: PathDetailsProps) => {
  if (!path || !pathMetrics) return null;

  return (
    <div className="animate-fade-in">
      <Card className="bg-card border-mars-dark/30 overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-mars-dark/20">
            <div className="p-5">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Map className="h-5 w-5 text-mars" />
                Path Analysis
              </h3>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-mars" />
                    <span className="text-sm">Distance</span>
                  </div>
                  <div className="text-sm font-medium">{pathMetrics.distance}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-mars" />
                    <span className="text-sm">Est. Travel Time</span>
                  </div>
                  <div className="text-sm font-medium">{pathMetrics.estimatedTime}</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-mars" />
                    <span className="text-sm">Terrain Difficulty</span>
                  </div>
                  <ProgressBar 
                    value={pathMetrics.terrainDifficulty} 
                    max={100} 
                    size="sm"
                    color={pathMetrics.terrainDifficulty > 70 ? 'danger' : 
                          pathMetrics.terrainDifficulty > 40 ? 'warning' : 'success'}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-mars" />
                    <span className="text-sm">Environmental Risk</span>
                  </div>
                  <ProgressBar 
                    value={pathMetrics.environmentalRisk} 
                    max={100} 
                    size="sm"
                    color={pathMetrics.environmentalRisk > 70 ? 'danger' : 
                          pathMetrics.environmentalRisk > 40 ? 'warning' : 'success'}
                  />
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Cloud className="h-5 w-5 text-mars" />
                Environmental Conditions
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-muted/30 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Weather</span>
                    </div>
                    <div className="text-sm">{pathMetrics.weatherConditions}</div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-red-400" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <div className="text-sm">{pathMetrics.temperature}</div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Wind Speed</span>
                    </div>
                    <div className="text-sm">{pathMetrics.windSpeed}</div>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">Visibility</span>
                    </div>
                    <div className="text-sm">{pathMetrics.visibility}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted/20 border-t border-mars-dark/20">
            <div className="text-sm text-gray-400">
              <strong className="text-white">Path Notes:</strong> This route has been optimized based on terrain analysis, 
              environmental factors, and rover capabilities. The path avoids major obstacles and hazardous terrain where possible.
              Rescue teams should monitor weather conditions before departure as dust storms may reduce visibility.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Import additional icons
import { AlertTriangle, Cloud } from 'lucide-react';

export default PathDetails;
