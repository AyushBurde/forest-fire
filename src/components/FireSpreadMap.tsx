import React, { useEffect, useRef, useState } from 'react';
import { SimulationState, WeatherData, ModelConfig } from '../types';
import { FirePredictionModel } from '../utils/fireModel';

interface FireSpreadMapProps {
  simulationState: SimulationState;
  weatherData: WeatherData;
  modelConfig: ModelConfig;
  activeLayer: string;
  zoom: number;
  onPredictionGenerated?: (accuracy: number) => void;
}

const FireSpreadMap: React.FC<FireSpreadMapProps> = ({
  simulationState,
  weatherData,
  modelConfig,
  activeLayer,
  zoom,
  onPredictionGenerated
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [fireModel] = useState(() => FirePredictionModel.getInstance());
  const [currentPrediction, setCurrentPrediction] = useState<any[]>([]);
  const [fireSpreadData, setFireSpreadData] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate new prediction when inputs change
  useEffect(() => {
    if (activeLayer === 'prediction') {
      generatePrediction();
    }
  }, [weatherData, modelConfig, activeLayer]);

  // Update fire spread simulation
  useEffect(() => {
    if (simulationState.isRunning && currentPrediction.length > 0) {
      updateFireSpread();
    }
  }, [simulationState.currentHour, simulationState.isRunning]);

  const generatePrediction = async () => {
    setIsGenerating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prediction = fireModel.generateProbabilityMap(
      weatherData,
      modelConfig,
      canvas.width,
      canvas.height
    );

    setCurrentPrediction(prediction);
    
    // Calculate model accuracy (simulated)
    const baseAccuracy = modelConfig.model === 'U-NET' ? 92.5 : 87.8;
    const weatherVariability = (Math.abs(weatherData.temperature - 25) + Math.abs(weatherData.humidity - 50)) / 100;
    const accuracy = Math.max(75, baseAccuracy - weatherVariability * 10 + (Math.random() - 0.5) * 5);
    
    onPredictionGenerated?.(accuracy);
    setIsGenerating(false);
  };

  const updateFireSpread = () => {
    if (currentPrediction.length === 0) return;

    // Find highest risk area as fire origin
    const highRiskAreas = currentPrediction.filter(p => p.risk === 'high');
    if (highRiskAreas.length === 0) return;

    const fireOrigin = highRiskAreas[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const spreadData = fireModel.simulateFireSpread(
      { x: fireOrigin.x, y: fireOrigin.y, radius: 20 },
      weatherData,
      simulationState.currentHour,
      canvas.width,
      canvas.height
    );

    setFireSpreadData(spreadData);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background terrain
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#22c55e');
      gradient.addColorStop(0.3, '#16a34a');
      gradient.addColorStop(0.7, '#15803d');
      gradient.addColorStop(1, '#166534');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add terrain texture
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 200; i++) {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = x1 + (Math.random() - 0.5) * 50;
        const y2 = y1 + (Math.random() - 0.5) * 50;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (activeLayer === 'prediction' && currentPrediction.length > 0) {
        // Render fire probability map
        currentPrediction.forEach(point => {
          const alpha = point.probability * 0.8;
          let color;
          
          switch (point.risk) {
            case 'high':
              color = `rgba(239, 68, 68, ${alpha})`;
              break;
            case 'moderate':
              color = `rgba(249, 115, 22, ${alpha})`;
              break;
            case 'low':
              color = `rgba(234, 179, 8, ${alpha})`;
              break;
            default:
              color = `rgba(34, 197, 94, ${alpha * 0.3})`;
          }

          ctx.fillStyle = color;
          ctx.fillRect(point.x, point.y, 30, 30);
        });

        // Show generation status
        if (isGenerating) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(0, 0, width, height);
          
          ctx.fillStyle = 'white';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Generating Prediction...', width / 2, height / 2);
          
          // Animated loading indicator
          const time = Date.now() / 1000;
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + time * 2;
            const x = width / 2 + Math.cos(angle) * 30;
            const y = height / 2 + 30 + Math.sin(angle) * 30;
            ctx.globalAlpha = (Math.sin(time * 3 + i) + 1) / 2;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }

      // Render active fire spread during simulation
      if (simulationState.isRunning && fireSpreadData.length > 0) {
        fireSpreadData.forEach(point => {
          const intensity = point.intensity;
          if (intensity > 0.1) {
            // Fire core
            const coreGradient = ctx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, 15 * intensity
            );
            coreGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity})`);
            coreGradient.addColorStop(0.3, `rgba(255, 100, 0, ${intensity * 0.9})`);
            coreGradient.addColorStop(0.7, `rgba(255, 50, 0, ${intensity * 0.7})`);
            coreGradient.addColorStop(1, `rgba(139, 69, 19, ${intensity * 0.3})`);

            ctx.fillStyle = coreGradient;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 15 * intensity, 0, Math.PI * 2);
            ctx.fill();

            // Flickering effect
            if (intensity > 0.5) {
              const flicker = Math.random() * 0.3 + 0.7;
              ctx.fillStyle = `rgba(255, 200, 0, ${intensity * flicker * 0.5})`;
              ctx.beginPath();
              ctx.arc(
                point.x + (Math.random() - 0.5) * 10,
                point.y + (Math.random() - 0.5) * 10,
                5 * intensity * flicker,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
          }
        });
      }

      // Wind direction indicator
      if (activeLayer === 'weather' || simulationState.isRunning) {
        const windX = width - 80;
        const windY = 80;
        const windAngle = (weatherData.windDirection * Math.PI) / 180;
        const windLength = Math.max(20, (weatherData.windSpeed / 100) * 60);

        // Wind arrow
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(windX, windY);
        ctx.lineTo(
          windX + Math.cos(windAngle) * windLength,
          windY + Math.sin(windAngle) * windLength
        );
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        const headX = windX + Math.cos(windAngle) * windLength;
        const headY = windY + Math.sin(windAngle) * windLength;
        ctx.moveTo(headX, headY);
        ctx.lineTo(
          headX + Math.cos(windAngle - 2.5) * 15,
          headY + Math.sin(windAngle - 2.5) * 15
        );
        ctx.lineTo(
          headX + Math.cos(windAngle + 2.5) * 15,
          headY + Math.sin(windAngle + 2.5) * 15
        );
        ctx.fill();

        // Wind speed label
        ctx.fillStyle = '#1f2937';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${weatherData.windSpeed} km/h`, windX, windY + 50);
      }

      // Model info overlay
      if (activeLayer === 'prediction') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(10, 10, 200, 60);
        
        ctx.fillStyle = '#1f2937';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Model: ${modelConfig.model}`, 20, 30);
        ctx.fillText(`Region: ${modelConfig.region}`, 20, 45);
        ctx.fillText(`Resolution: ${modelConfig.resolution}m`, 20, 60);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentPrediction, fireSpreadData, simulationState, weatherData, activeLayer, isGenerating]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="w-full h-full object-cover cursor-crosshair"
      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
    />
  );
};

export default FireSpreadMap;