import React, { useState } from 'react';
import { Cloud, Thermometer, Droplets, Wind, Settings, Play, CheckCircle, AlertCircle } from 'lucide-react';
import { WeatherData, ModelConfig } from '../types';

interface ControlPanelProps {
  weatherData: WeatherData;
  setWeatherData: (data: WeatherData) => void;
  modelConfig: ModelConfig;
  setModelConfig: (config: ModelConfig) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  weatherData,
  setWeatherData,
  modelConfig,
  setModelConfig
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const handleWeatherChange = (field: keyof WeatherData, value: number) => {
    setWeatherData({ ...weatherData, [field]: value });
  };

  const handleModelChange = (field: keyof ModelConfig, value: any) => {
    setModelConfig({ ...modelConfig, [field]: value });
  };

  const generatePrediction = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastGenerated(new Date());
    setIsGenerating(false);
  };

  const getFireRiskLevel = () => {
    const riskScore = (
      (weatherData.temperature / 50) * 0.3 +
      ((100 - weatherData.humidity) / 100) * 0.3 +
      (weatherData.windSpeed / 100) * 0.2 +
      ((10 - weatherData.precipitation) / 10) * 0.2
    );

    if (riskScore > 0.7) return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
    if (riskScore > 0.4) return { level: 'Moderate', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (riskScore > 0.2) return { level: 'Low', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'Very Low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const riskLevel = getFireRiskLevel();

  return (
    <div className="p-4 space-y-6">
      {/* Current Risk Assessment */}
      <div className={`p-3 rounded-lg border ${riskLevel.bg}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Current Fire Risk</span>
          <span className={`text-sm font-bold ${riskLevel.color}`}>
            {riskLevel.level}
          </span>
        </div>
      </div>

      {/* Model Configuration */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Settings className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Model Configuration</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              ML Model
            </label>
            <select
              value={modelConfig.model}
              onChange={(e) => handleModelChange('model', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="U-NET">U-NET (Accuracy: 92.5%)</option>
              <option value="LSTM">LSTM (Accuracy: 87.8%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={modelConfig.region}
              onChange={(e) => handleModelChange('region', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Resolution
            </label>
            <select
              value={modelConfig.resolution}
              onChange={(e) => handleModelChange('resolution', Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={10}>10m (High Detail)</option>
              <option value={30}>30m (Standard)</option>
              <option value={100}>100m (Regional)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Prediction Type
            </label>
            <select
              value={modelConfig.predictionType}
              onChange={(e) => handleModelChange('predictionType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="binary">Binary Classification</option>
              <option value="probabilistic">Probabilistic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Weather Parameters */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Cloud className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Weather Parameters</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Thermometer className="h-3 w-3 text-red-500" />
                <label className="text-xs font-medium text-gray-700">Temperature</label>
              </div>
              <span className="text-xs text-gray-600">{weatherData.temperature}°C</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={weatherData.temperature}
              onChange={(e) => handleWeatherChange('temperature', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0°C</span>
              <span>50°C</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Droplets className="h-3 w-3 text-blue-500" />
                <label className="text-xs font-medium text-gray-700">Humidity</label>
              </div>
              <span className="text-xs text-gray-600">{weatherData.humidity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weatherData.humidity}
              onChange={(e) => handleWeatherChange('humidity', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Wind className="h-3 w-3 text-gray-500" />
                <label className="text-xs font-medium text-gray-700">Wind Speed</label>
              </div>
              <span className="text-xs text-gray-600">{weatherData.windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weatherData.windSpeed}
              onChange={(e) => handleWeatherChange('windSpeed', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 km/h</span>
              <span>100 km/h</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700">Wind Direction</label>
              <span className="text-xs text-gray-600">{weatherData.windDirection}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={weatherData.windDirection}
              onChange={(e) => handleWeatherChange('windDirection', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>N (0°)</span>
              <span>S (180°)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700">Precipitation</label>
              <span className="text-xs text-gray-600">{weatherData.precipitation} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weatherData.precipitation}
              onChange={(e) => handleWeatherChange('precipitation', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 mm</span>
              <span>100 mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={generatePrediction}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Generate Prediction</span>
          </>
        )}
      </button>

      {/* Last Generated Info */}
      {lastGenerated && (
        <div className="flex items-center space-x-2 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Last updated: {lastGenerated.toLocaleTimeString()}</span>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;