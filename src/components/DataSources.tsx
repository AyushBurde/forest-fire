import React from 'react';
import { Database, Wifi, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { DataSource } from '../types';

const DataSources: React.FC = () => {
  const dataSources: DataSource[] = [
    {
      name: 'MOSDAC Weather Data',
      type: 'weather',
      status: 'connected',
      lastUpdated: '2 minutes ago',
      source: 'https://mosdac.gov.in'
    },
    {
      name: 'ERA-5 Reanalysis',
      type: 'weather',
      status: 'connected',
      lastUpdated: '5 minutes ago',
      source: 'Copernicus Climate Data Store'
    },
    {
      name: 'IMD Weather Station',
      type: 'weather',
      status: 'loading',
      lastUpdated: '1 hour ago',
      source: 'India Meteorological Department'
    },
    {
      name: 'Bhoonidhi DEM',
      type: 'terrain',
      status: 'connected',
      lastUpdated: '1 day ago',
      source: 'ISRO Bhoonidhi Portal'
    },
    {
      name: 'Bhuvan LULC',
      type: 'lulc',
      status: 'connected',
      lastUpdated: '3 hours ago',
      source: 'ISRO Bhuvan'
    },
    {
      name: 'Sentinel Hub',
      type: 'lulc',
      status: 'connected',
      lastUpdated: '30 minutes ago',
      source: 'ESA Sentinel Hub'
    },
    {
      name: 'VIIRS Fire Data',
      type: 'fire',
      status: 'connected',
      lastUpdated: '15 minutes ago',
      source: 'NASA FIRMS'
    },
    {
      name: 'GHSL Settlement',
      type: 'terrain',
      status: 'error',
      lastUpdated: '2 hours ago',
      source: 'JRC Global Human Settlement'
    }
  ];

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'loading':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getTypeColor = (type: DataSource['type']) => {
    switch (type) {
      case 'weather':
        return 'bg-blue-100 text-blue-700';
      case 'terrain':
        return 'bg-green-100 text-green-700';
      case 'lulc':
        return 'bg-purple-100 text-purple-700';
      case 'fire':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Database className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Data Sources</h3>
        </div>
        
        <div className="space-y-3">
          {dataSources.map((source, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{source.name}</h4>
                    {getStatusIcon(source.status)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(source.type)}`}>
                      {source.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Updated {source.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600">{source.source}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Quality</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Coverage</span>
            <span className="text-xs font-medium text-gray-900">98.5%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.5%' }} />
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-600">Temporal Resolution</span>
            <span className="text-xs font-medium text-gray-900">15 min</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }} />
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-600">Spatial Resolution</span>
            <span className="text-xs font-medium text-gray-900">30m</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">System Status</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Wifi className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-700">All Systems Operational</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            7/8 data sources connected and streaming
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataSources;