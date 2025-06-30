import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers, MapPin, RefreshCw } from 'lucide-react';
import { SimulationState, WeatherData, ModelConfig } from '../types';
import FireSpreadMap from './FireSpreadMap';
import MapLegend from './MapLegend';

interface MapViewProps {
  simulationState: SimulationState;
  weatherData: WeatherData;
  modelConfig: ModelConfig;
}

const MapView: React.FC<MapViewProps> = ({ simulationState, weatherData, modelConfig }) => {
  const [zoom, setZoom] = useState(8);
  const [activeLayer, setActiveLayer] = useState<'prediction' | 'terrain' | 'weather'>('prediction');
  const [showLegend, setShowLegend] = useState(true);
  const [lastPredictionAccuracy, setLastPredictionAccuracy] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerateMap = () => {
    setIsRegenerating(true);
    // Force regeneration by changing a key prop
    setTimeout(() => setIsRegenerating(false), 100);
  };

  return (
    <div className="relative h-full bg-gray-100">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={() => setZoom(Math.min(zoom + 1, 15))}
            className="block w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors mb-1"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4 mx-auto" />
          </button>
          <button
            onClick={() => setZoom(Math.max(zoom - 1, 3))}
            className="block w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors mb-1"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4 mx-auto" />
          </button>
          <button
            onClick={() => setZoom(8)}
            className="block w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors mb-1"
            title="Reset View"
          >
            <RotateCcw className="h-4 w-4 mx-auto" />
          </button>
          <button
            onClick={handleRegenerateMap}
            className="block w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Regenerate Map"
          >
            <RefreshCw className="h-4 w-4 mx-auto" />
          </button>
        </div>
      </div>

      {/* Layer Controls */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2 mb-3">
            <Layers className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Layers</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="layer"
                value="prediction"
                checked={activeLayer === 'prediction'}
                onChange={(e) => setActiveLayer(e.target.value as any)}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Fire Prediction</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="layer"
                value="terrain"
                checked={activeLayer === 'terrain'}
                onChange={(e) => setActiveLayer(e.target.value as any)}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Terrain</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="layer"
                value="weather"
                checked={activeLayer === 'weather'}
                onChange={(e) => setActiveLayer(e.target.value as any)}
                className="text-green-500 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Weather</span>
            </label>
          </div>
        </div>
      </div>

      {/* Region Info */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">{modelConfig.region}</p>
              <p className="text-xs text-gray-500">Resolution: {modelConfig.resolution}m</p>
              {lastPredictionAccuracy && (
                <p className="text-xs text-green-600">
                  Accuracy: {lastPredictionAccuracy.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Map */}
      <FireSpreadMap
        key={isRegenerating ? Date.now() : 'map'}
        simulationState={simulationState}
        weatherData={weatherData}
        modelConfig={modelConfig}
        activeLayer={activeLayer}
        zoom={zoom}
        onPredictionGenerated={setLastPredictionAccuracy}
      />

      {/* Legend */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 z-10">
          <MapLegend
            activeLayer={activeLayer}
            onClose={() => setShowLegend(false)}
          />
        </div>
      )}

      {/* Legend Toggle */}
      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 text-gray-600 hover:text-gray-900 transition-colors"
          title="Show Legend"
        >
          <Layers className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default MapView;