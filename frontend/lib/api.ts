import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
});

// Todo: Sensor Data 
export const fetchLatestReadings = (limit = 20) =>
  api.get(`/sensor-data/latest?limit=${limit}`);

export const fetchSensorHistory = (params: {
  device_id?: string;
  start?: string;
  end?: string;
}) => api.get("/sensor-data/history", { params });

// Todo: Devices 
export const fetchDevices = () => api.get("/devices/");

// Todo: Alerts 
export const fetchAlerts = (limit = 50) =>
  api.get(`/alerts/?limit=${limit}`);

// Todo: Analytics 
export const fetchAverageByHour = () => api.get("/analytics/avg-by-hour");
export const fetchPeakTimes = (threshold = 70) =>
  api.get("/analytics/peak-times", { params: { threshold } });
export const fetchMostAffectedLocations = () =>
  api.get("/analytics/affected-locations");

// Todo: Predictions
export const fetchPrediction = (deviceId: string, days = 1) =>
  api.get(`/predictions/${deviceId}`, { params: { days } });