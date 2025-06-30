import { WeatherData, ModelConfig, FireProbability, TerrainData } from '../types';

export class FirePredictionModel {
  private static instance: FirePredictionModel;
  
  static getInstance(): FirePredictionModel {
    if (!FirePredictionModel.instance) {
      FirePredictionModel.instance = new FirePredictionModel();
    }
    return FirePredictionModel.instance;
  }

  // Generate fire probability map based on inputs
  generateProbabilityMap(
    weatherData: WeatherData,
    modelConfig: ModelConfig,
    width: number,
    height: number
  ): FireProbability[] {
    const probabilities: FireProbability[] = [];
    const gridSize = 30; // 30m resolution
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const terrain = this.generateTerrainData(x, y, width, height);
        const probability = this.calculateFireProbability(weatherData, terrain, modelConfig);
        
        probabilities.push({
          x,
          y,
          probability,
          risk: this.classifyRisk(probability)
        });
      }
    }
    
    return probabilities;
  }

  private generateTerrainData(x: number, y: number, width: number, height: number): TerrainData {
    // Simulate terrain data based on position
    const normalizedX = x / width;
    const normalizedY = y / height;
    
    // Generate realistic terrain variations
    const elevation = 1000 + Math.sin(normalizedX * Math.PI * 2) * 500 + Math.cos(normalizedY * Math.PI * 3) * 300;
    const slope = Math.abs(Math.sin(normalizedX * 10) * Math.cos(normalizedY * 8)) * 45; // 0-45 degrees
    const aspect = (normalizedX * 360) % 360; // 0-360 degrees
    
    // Fuel load based on terrain and region
    let fuelLoad = 0.5; // Base fuel load
    if (elevation > 1200) fuelLoad += 0.3; // Higher elevation = more vegetation
    if (slope < 15) fuelLoad += 0.2; // Gentle slopes accumulate more fuel
    
    return { slope, aspect, elevation, fuelLoad: Math.min(fuelLoad, 1.0) };
  }

  private calculateFireProbability(
    weather: WeatherData,
    terrain: TerrainData,
    config: ModelConfig
  ): number {
    let probability = 0;

    // Weather factors
    const tempFactor = this.normalizeTemperature(weather.temperature);
    const humidityFactor = 1 - (weather.humidity / 100);
    const windFactor = Math.min(weather.windSpeed / 50, 1);
    const precipFactor = Math.max(0, 1 - (weather.precipitation / 20));

    // Terrain factors
    const slopeFactor = Math.min(terrain.slope / 45, 1);
    const fuelFactor = terrain.fuelLoad;
    const elevationFactor = terrain.elevation > 1500 ? 0.8 : 1.0;

    if (config.model === 'U-NET') {
      // U-NET model simulation
      probability = (
        tempFactor * 0.25 +
        humidityFactor * 0.20 +
        windFactor * 0.15 +
        precipFactor * 0.15 +
        slopeFactor * 0.10 +
        fuelFactor * 0.15
      ) * elevationFactor;
    } else {
      // LSTM model simulation
      probability = (
        tempFactor * 0.30 +
        humidityFactor * 0.25 +
        windFactor * 0.20 +
        precipFactor * 0.10 +
        slopeFactor * 0.08 +
        fuelFactor * 0.07
      ) * elevationFactor;
    }

    // Add regional adjustments
    if (config.region === 'Uttarakhand') probability *= 1.1;
    if (config.region === 'Kerala') probability *= 0.9;
    if (config.region === 'Assam') probability *= 1.05;

    // Add some realistic noise
    probability += (Math.random() - 0.5) * 0.1;

    return Math.max(0, Math.min(1, probability));
  }

  private normalizeTemperature(temp: number): number {
    // Normalize temperature (0-50°C) to fire risk factor
    if (temp < 15) return 0.1;
    if (temp < 25) return 0.3;
    if (temp < 35) return 0.7;
    return 1.0;
  }

  private classifyRisk(probability: number): 'high' | 'moderate' | 'low' | 'nil' {
    if (probability > 0.7) return 'high';
    if (probability > 0.4) return 'moderate';
    if (probability > 0.2) return 'low';
    return 'nil';
  }

  // Cellular Automata fire spread simulation
  simulateFireSpread(
    initialFire: { x: number; y: number; radius: number },
    weatherData: WeatherData,
    hours: number,
    width: number,
    height: number
  ): { x: number; y: number; intensity: number }[] {
    const firePoints: { x: number; y: number; intensity: number; age: number }[] = [];
    const gridSize = 10;
    
    // Initialize fire center
    firePoints.push({
      x: initialFire.x,
      y: initialFire.y,
      intensity: 1.0,
      age: 0
    });

    // Simulate spread over time
    for (let hour = 0; hour < hours; hour++) {
      const newFirePoints = [...firePoints];
      
      firePoints.forEach(point => {
        if (point.intensity > 0.1) {
          // Calculate spread in 8 directions
          const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
          ];

          directions.forEach(([dx, dy]) => {
            const newX = point.x + dx * gridSize;
            const newY = point.y + dy * gridSize;

            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
              const spreadProbability = this.calculateSpreadProbability(
                point, { x: newX, y: newY }, weatherData, dx, dy
              );

              if (Math.random() < spreadProbability) {
                const existingPoint = newFirePoints.find(p => 
                  Math.abs(p.x - newX) < gridSize && Math.abs(p.y - newY) < gridSize
                );

                if (!existingPoint) {
                  newFirePoints.push({
                    x: newX,
                    y: newY,
                    intensity: point.intensity * 0.8,
                    age: 0
                  });
                }
              }
            }
          });
        }
      });

      // Age existing fires and reduce intensity
      newFirePoints.forEach(point => {
        point.age += 1;
        point.intensity *= 0.95; // Gradual intensity reduction
      });

      firePoints.length = 0;
      firePoints.push(...newFirePoints);
    }

    return firePoints.map(p => ({ x: p.x, y: p.y, intensity: p.intensity }));
  }

  private calculateSpreadProbability(
    fromPoint: { x: number; y: number; intensity: number },
    toPoint: { x: number; y: number },
    weather: WeatherData,
    dx: number,
    dy: number
  ): number {
    let probability = fromPoint.intensity * 0.3;

    // Wind effect
    const windAngleRad = (weather.windDirection * Math.PI) / 180;
    const windDx = Math.cos(windAngleRad);
    const windDy = Math.sin(windAngleRad);
    
    const windAlignment = (dx * windDx + dy * windDy) / Math.sqrt(dx * dx + dy * dy);
    const windEffect = (windAlignment + 1) / 2; // Normalize to 0-1
    
    probability *= (1 + windEffect * weather.windSpeed / 50);

    // Weather conditions
    probability *= (1 - weather.humidity / 200); // High humidity reduces spread
    probability *= Math.max(0.1, 1 - weather.precipitation / 10); // Rain reduces spread
    probability *= (weather.temperature / 50); // Higher temp increases spread

    return Math.min(probability, 0.8);
  }
}