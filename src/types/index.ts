export interface SimulationState {
  isRunning: boolean;
  currentHour: number;
  maxHours: number;
  speed: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
}

export interface ModelConfig {
  model: 'U-NET' | 'LSTM';
  resolution: number;
  region: string;
  predictionType: 'binary' | 'probabilistic';
}

export interface FireProbability {
  x: number;
  y: number;
  probability: number;
  risk: 'high' | 'moderate' | 'low' | 'nil';
}

export interface TerrainData {
  slope: number;
  aspect: number;
  elevation: number;
  fuelLoad: number;
}

export interface DataSource {
  name: string;
  type: 'weather' | 'terrain' | 'lulc' | 'fire';
  status: 'connected' | 'loading' | 'error';
  lastUpdated: string;
  source: string;
}