import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const MetricsPanel: React.FC = () => {
  const accuracyData = [
    { name: 'U-NET', accuracy: 92.5, precision: 89.2, recall: 94.1 },
    { name: 'LSTM', accuracy: 87.8, precision: 85.4, recall: 90.3 },
    { name: 'Random Forest', accuracy: 84.2, precision: 82.1, recall: 86.7 },
  ];

  const spreadData = [
    { hour: 0, area: 0, prediction: 0 },
    { hour: 1, area: 12, prediction: 15 },
    { hour: 2, area: 28, prediction: 32 },
    { hour: 3, area: 45, prediction: 48 },
    { hour: 6, area: 89, prediction: 92 },
    { hour: 12, area: 156, prediction: 162 },
  ];

  const riskDistribution = [
    { name: 'High Risk', value: 23, color: '#ef4444' },
    { name: 'Moderate Risk', value: 34, color: '#f97316' },
    { name: 'Low Risk', value: 28, color: '#eab308' },
    { name: 'No Risk', value: 15, color: '#22c55e' },
  ];

  return (
    <div className="h-full bg-white">
      <div className="flex border-b border-gray-200">
        <div className="px-4 py-3 border-b-2 border-green-500 bg-green-50">
          <span className="text-sm font-medium text-green-700">Model Performance</span>
        </div>
        <div className="px-4 py-3">
          <span className="text-sm text-gray-600">Spread Analysis</span>
        </div>
        <div className="px-4 py-3">
          <span className="text-sm text-gray-600">Risk Distribution</span>
        </div>
      </div>

      <div className="flex h-[calc(100%-3rem)]">
        {/* Model Performance Chart */}
        <div className="w-1/3 p-4 border-r border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Model Accuracy Comparison</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#22c55e" name="Accuracy %" />
              <Bar dataKey="precision" fill="#3b82f6" name="Precision %" />
              <Bar dataKey="recall" fill="#f97316" name="Recall %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fire Spread Analysis */}
        <div className="w-1/3 p-4 border-r border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Fire Spread vs Prediction</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spreadData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="area" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Actual Spread (km²)"
              />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Predicted Spread (km²)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="w-1/3 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Risk Zone Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {riskDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;