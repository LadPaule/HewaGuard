"use client";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLatestReadings,
  fetchSensorHistory,
  fetchDevices,
  fetchMostAffectedLocations,
  fetchPrediction,
} from "@/lib/api";
import { Device, SensorReading } from "@/lib/types";
import { mergeDevicesIntoReadings } from "@/lib/dataUtils";
import StatusCard from "@/components/ui/StatusCard";
import GasLineChart from "@/components/charts/GasLineChart";
import LocationBarChart from "@/components/charts/LocationBarChart";
import StatusPieChart from "@/components/charts/StatusPieChart";
import PredictionChart from "@/components/charts/PredictionChart";
import LatestReadingsTable from "@/components/ui/DataTable";
import { useState } from "react";
import { subHours } from "date-fns";

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  // Fetch devices (once, stale for 5 min)
  const { data: devices } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => (await fetchDevices()).data,
    staleTime: 5 * 60 * 1000,
  });

  // Latest readings – refetch every 60s, stale after 30s
  const { data: latestRaw, isLoading: latestLoading } = useQuery<SensorReading[]>({
    queryKey: ["latest-readings"],
    queryFn: async () => (await fetchLatestReadings(100)).data,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // History for line chart
  const end = new Date();
  const start = subHours(end, 24);
  const { data: historyRaw } = useQuery<SensorReading[]>({
    queryKey: ["sensor-history", selectedDevice, start, end],
    queryFn: async () =>
      (
        await fetchSensorHistory({
          device_id: selectedDevice || undefined,
          start: start.toISOString(),
          end: end.toISOString(),
        })
      ).data,
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Affected locations
  const { data: affectedLocations } = useQuery<{ location: string; avg_gas: number }[]>({
    queryKey: ["affected-locations"],
    queryFn: async () => (await fetchMostAffectedLocations()).data,
    refetchInterval: 120000,
    staleTime: 60000,
  });

  // Predictions (only when device selected)
  const {
    data: predictionData,
    isLoading: predLoading,
    error: predError,
  } = useQuery<{ ds: string; yhat: number; yhat_lower: number; yhat_upper: number }[]>({
    queryKey: ["prediction", selectedDevice],
    queryFn: async () => {
      if (!selectedDevice) return null;
      return (await fetchPrediction(selectedDevice, 1)).data;
    },
    enabled: !!selectedDevice,
    retry: false,
  });

  // Merge device details into readings
  const latestData = latestRaw && devices ? mergeDevicesIntoReadings(latestRaw, devices) : undefined;
  const historyData = historyRaw && devices ? mergeDevicesIntoReadings(historyRaw, devices) : undefined;

  // Status distribution (from latestData)
  const statusCounts = latestData?.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});
  const statusPieData: { status: string; count: number }[] = statusCounts
    ? Object.entries(statusCounts).map(([status, count]) => ({ status, count }))
    : [];

  // Group latest readings by device (latest per device)
  const deviceStatuses = latestData?.reduce<Record<string, SensorReading & { device?: Device }>>((acc, reading) => {
    const devId = reading.device?.device_id || String(reading.device_id);
    if (!acc[devId] || new Date(reading.timestamp) > new Date(acc[devId].timestamp)) {
      acc[devId] = reading;
    }
    return acc;
  }, {});

  if (latestLoading) return <div className="p-8 text-gray-900 dark:text-gray-100">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Device Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2"
        >
          <option value="">All Devices</option>
          {devices?.map((d) => (
            <option key={d.id} value={d.device_id}>{d.device_id} - {d.location}</option>
          ))}
        </select>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(deviceStatuses || {}).length > 0 ? (
          Object.values(deviceStatuses!).map((reading) => (
            <StatusCard key={reading.id} reading={reading} />
          ))
        ) : (
          <p className="col-span-4 text-gray-500 dark:text-gray-400">No device data available.</p>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Gas Levels (24h)</h3>
          {historyData && historyData.length > 0 ? (
            <GasLineChart data={historyData} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No history data for the selected period.</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Avg Pollution by Location</h3>
          {affectedLocations && affectedLocations.length > 0 ? (
            <LocationBarChart data={affectedLocations} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No location analytics yet.</p>
          )}
        </div>
      </div>

      {/* Status Pie & Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Status Distribution</h3>
          {statusPieData.length > 0 ? (
            <StatusPieChart data={statusPieData} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No status data available.</p>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
            Prediction {selectedDevice ? `for ${selectedDevice}` : ""}
          </h3>
          {selectedDevice ? (
            predLoading ? (
              <p className="text-gray-500 dark:text-gray-400">Loading prediction...</p>
            ) : predError ? (
              <p className="text-red-500">Not enough data for prediction.</p>
            ) : predictionData ? (
              <PredictionChart data={predictionData} />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No prediction data.</p>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Select a device to see its prediction.</p>
          )}
        </div>
      </div>

      {/* Latest Readings Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Latest Readings</h3>
        {latestData && latestData.length > 0 ? (
          <LatestReadingsTable data={latestData.slice(0, 20)} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent readings.</p>
        )}
      </div>
    </div>
  );
}