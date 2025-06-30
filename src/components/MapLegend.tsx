import React from 'react';
import { X } from 'lucide-react';

interface MapLegendProps {
  activeLayer: string;
  onClose: () => void;
}

const MapLegend: React.FC<MapLegendProps> = ({ activeLayer, onClose }) => {
  const getLegendItems = () => {
    switch (activeLayer) {
      case 'prediction':
        return [
          { color: '#ef4444', label: 'High Risk', opacity: 0.8 },
          { color: '#f97316', label: 'Moderate Risk', opacity: 0.6 },
          { color: '#eab308', label: 'Low Risk', opacity: 0.4 },
          { color: '#22c55e', label: 'No Risk', opacity: 0.2 },
        ];
      case 'terrain':
        return [
          { color: '#8b5cf6', label: 'High Elevation', opacity: 1 },
          { color: '#06b6d4', label: 'Medium Elevation', opacity: 1 },
          { color: '#10b981', label: 'Low Elevation', opacity: 1 },
          { color: '#84cc16', label: 'Water Bodies', opacity: 1 },
        ];
      case 'weather':
        return [
          { color: '#3b82f6', label: 'Wind Direction', opacity: 1 },
          { color: '#ef4444', label: 'High Temperature', opacity: 0.6 },
          { color: '#06b6d4', label: 'High Humidity', opacity: 0.6 },
          { color: '#6366f1', label: 'Precipitation', opacity: 0.6 },
        ];
      default:
        return [];
    }
  };

  const legendItems = getLegendItems();

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-48">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 capitalize">
          {activeLayer} Legend
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: item.color,
                opacity: item.opacity
              }}
            />
            <span className="text-xs text-gray-700">{item.label}</span>
          </div>
        ))}
      </div>
      
      {activeLayer === 'prediction' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Prediction based on U-NET model with 30m resolution
          </p>
        </div>
      )}
    </div>
  );
};

export default MapLegend;