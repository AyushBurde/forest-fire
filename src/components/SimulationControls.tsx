import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Flame } from 'lucide-react';
import { SimulationState } from '../types';

interface SimulationControlsProps {
  simulationState: SimulationState;
  setSimulationState: (state: SimulationState) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  simulationState,
  setSimulationState
}) => {
  const toggleSimulation = () => {
    setSimulationState({
      ...simulationState,
      isRunning: !simulationState.isRunning
    });
  };

  const resetSimulation = () => {
    setSimulationState({
      ...simulationState,
      isRunning: false,
      currentHour: 0
    });
  };

  const changeSpeed = (speed: number) => {
    setSimulationState({
      ...simulationState,
      speed
    });
  };

  const setMaxHours = (maxHours: number) => {
    setSimulationState({
      ...simulationState,
      maxHours,
      currentHour: Math.min(simulationState.currentHour, maxHours)
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Simulation Status */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Flame className="h-4 w-4 text-orange-600" />
          <h3 className="text-sm font-semibold text-gray-900">Fire Spread Simulation</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Status</span>
            <span className={`text-xs font-medium ${
              simulationState.isRunning ? 'text-orange-600' : 'text-gray-600'
            }`}>
              {simulationState.isRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Current Time</span>
            <span className="text-xs font-medium text-gray-900">
              {simulationState.currentHour}h / {simulationState.maxHours}h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(simulationState.currentHour / simulationState.maxHours) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Time Controls */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Clock className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Time Settings</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Simulation Duration
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 6, 12].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setMaxHours(hours)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    simulationState.maxHours === hours
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Playback Speed
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[0.5, 1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    simulationState.speed === speed
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Controls */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Controls</h3>
        <div className="flex space-x-2">
          <button
            onClick={toggleSimulation}
            className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              simulationState.isRunning
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {simulationState.isRunning ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Start</span>
              </>
            )}
          </button>
          <button
            onClick={resetSimulation}
            className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cellular Automata Parameters */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">CA Parameters</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Spread Rate Factor
            </label>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              defaultValue="1.0"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Wind Effect
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Terrain Influence
            </label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="30"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;