import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import ControlPanel from './components/ControlPanel';
import SimulationControls from './components/SimulationControls';
import MetricsPanel from './components/MetricsPanel';
import DataSources from './components/DataSources';
import { SimulationState, WeatherData, ModelConfig } from './types';

function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    currentHour: 0,
    maxHours: 12,
    speed: 1
  });

  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 32,
    humidity: 45,
    windSpeed: 15,
    windDirection: 225,
    precipitation: 0
  });

  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    model: 'U-NET',
    resolution: 30,
    region: 'Uttarakhand',
    predictionType: 'binary'
  });

  const [activeTab, setActiveTab] = useState<'prediction' | 'simulation' | 'data'>('prediction');

  // Auto-advance simulation time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (simulationState.isRunning && simulationState.currentHour < simulationState.maxHours) {
      interval = setInterval(() => {
        setSimulationState(prev => ({
          ...prev,
          currentHour: Math.min(prev.currentHour + 1, prev.maxHours)
        }));
      }, 1000 / simulationState.speed);
    } else if (simulationState.currentHour >= simulationState.maxHours) {
      setSimulationState(prev => ({ ...prev, isRunning: false }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulationState.isRunning, simulationState.currentHour, simulationState.maxHours, simulationState.speed]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('prediction')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'prediction'
                  ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Prediction
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'simulation'
                  ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Simulation
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'data'
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Data
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'prediction' && (
              <ControlPanel
                weatherData={weatherData}
                setWeatherData={setWeatherData}
                modelConfig={modelConfig}
                setModelConfig={setModelConfig}
              />
            )}
            {activeTab === 'simulation' && (
              <SimulationControls
                simulationState={simulationState}
                setSimulationState={setSimulationState}
              />
            )}
            {activeTab === 'data' && <DataSources />}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Map View */}
          <div className="flex-1">
            <MapView
              simulationState={simulationState}
              weatherData={weatherData}
              modelConfig={modelConfig}
            />
          </div>

          {/* Bottom Panel */}
          <div className="h-64 border-t border-gray-200 bg-white">
            <MetricsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;