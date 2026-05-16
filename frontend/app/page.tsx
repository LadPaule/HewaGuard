"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchLatestReadings, fetchSensorHistory } from "@/lib/api";
import StatusCard from "@/components/ui/StatusCard";
import GasLineChart from "@/components/charts/GasLineChart";
import LatestReadingsTable from "@/components/ui/DataTable";
import { useState } from "react";
import { subHours } from "date-fns";

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>(undefined);

  //Todo: Fetch latest readings (auto-refresh every 30s)
  const { data: latestData, isLoading: latestLoading } = useQuery({
    queryKey: ["latest-readings"],
    queryFn: async () => (await fetchLatestReadings(50)).data,
    refetchInterval: 30000,
  });

  //Todo: Fetch history for line chart
  const end = new Date();
  const start = subHours(end, 24);
  const { data: historyData } = useQuery({
    queryKey: ["sensor-history", selectedDevice, start, end],
    queryFn: async () =>
      (
        await fetchSensorHistory({
          device_id: selectedDevice,
          start: start.toISOString(),
          end: end.toISOString(),
        })
      ).data,
    refetchInterval: 30000,
  });

  //Todo: Group latest readings by device for status cards
  const deviceStatuses = latestData?.reduce((acc: any, reading: any) => {
    if (!acc[reading.device_id]) acc[reading.device_id] = reading;
    return acc;
  }, {});

  if (latestLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(deviceStatuses || {}).map((reading: any) => (
          <StatusCard key={reading.id} reading={reading} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={selectedDevice || ""}
          onChange={(e) => setSelectedDevice(e.target.value || undefined)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Devices</option>
          {/* We could fetch device list here */}
        </select>
      </div>

      {/* Gas Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Gas Levels (24 hours)</h3>
        <GasLineChart data={historyData || []} />
      </div>

      {/* Latest Readings Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Latest Readings</h3>
        <LatestReadingsTable data={latestData?.slice(0, 20) || []} />
      </div>
    </div>
  );
}