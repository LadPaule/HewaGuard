"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchDevices, fetchLatestReadings } from "@/lib/api";
import { Device, SensorReading } from "@/lib/types";
import { mergeDevicesIntoReadings } from "@/lib/dataUtils";
import StatusCard from "@/components/ui/StatusCard";

export default function DevicesPage() {
  const { data: devices } = useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: async () => (await fetchDevices()).data,
  });
  const { data: latestRaw } = useQuery<SensorReading[]>({
    queryKey: ["latest-readings"],
    queryFn: async () => (await fetchLatestReadings(100)).data,
    refetchInterval: 60000,
  });

  const latestData = latestRaw && devices ? mergeDevicesIntoReadings(latestRaw, devices) : [];

  // Group latest per device
  const deviceLatest = latestData?.reduce<Record<number, SensorReading & { device?: Device }>>((acc, r) => {
    if (!acc[r.device_id] || new Date(r.timestamp) > new Date(acc[r.device_id].timestamp)) {
      acc[r.device_id] = r;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Devices</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices?.map((d) => {
          const reading = deviceLatest?.[d.id];
          return reading ? (
            <StatusCard key={d.id} reading={reading} />
          ) : (
            <div key={d.id} className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <p className="font-bold">{d.device_id}</p>
              <p className="text-sm">{d.location}</p>
              <p className="text-xs mt-2 opacity-75">No readings yet</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}