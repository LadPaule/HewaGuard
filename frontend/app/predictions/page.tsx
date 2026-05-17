"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchDevices, fetchPrediction } from "@/lib/api";
import { Device } from "@/lib/types";
import PredictionChart from "@/components/charts/PredictionChart";
import { useState } from "react";

export default function PredictionsPage() {
  const { data: devices } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => (await fetchDevices()).data,
  });
  const [selectedDevice, setSelectedDevice] = useState("");

  const {
    data: predictionData,
    isLoading: predLoading,
    error: predError,
  } = useQuery<{ ds: string; yhat: number; yhat_lower: number; yhat_upper: number }[]>({
    queryKey: ["prediction", selectedDevice],
    queryFn: async () => (await fetchPrediction(selectedDevice, 1)).data,
    enabled: !!selectedDevice,
    retry: false,
  });

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Predictions</h1>
      <select
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
        className="border px-3 py-2 rounded dark:bg-gray-800"
      >
        <option value="">Select device</option>
        {devices?.map((d) => (
          <option key={d.id} value={d.device_id}>{d.device_id}</option>
        ))}
      </select>
      {selectedDevice ? (
        predLoading ? (
          <p>Loading...</p>
        ) : predError ? (
          <p className="text-red-500">Not enough data to generate prediction. Let the simulator run for a few hours.</p>
        ) : predictionData ? (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <PredictionChart data={predictionData} />
          </div>
        ) : (
          <p>No prediction data returned.</p>
        )
      ) : (
        <p>Select a device to view its forecast.</p>
      )}
    </div>
  );
}