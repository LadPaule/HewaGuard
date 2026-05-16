export interface Device {
  id: number;
  device_id: string;
  location: string;
  installed_at: string;
}

export interface SensorReading {
  id: number;
  device_id: number;  // FK, but we'll resolve to device_id string later
  timestamp: string;
  gas_value: number;
  temperature: number;
  status: "SAFE" | "MODERATE" | "DANGEROUS";
  device?: Device;  // if joined
}

export interface Alert {
  id: number;
  device_id: number;
  sensor_data_id: number;
  message: string;
  created_at: string;
  resolved: boolean;
}

export interface AvgByHour {
  hour: number;
  avg_gas: number;
}

export interface AffectedLocation {
  location: string;
  avg_gas: number;
}

export interface PredictionPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}