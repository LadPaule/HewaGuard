"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMostAffectedLocations, fetchPeakTimes } from "@/lib/api";
import LocationBarChart from "@/components/charts/LocationBarChart";

export default function AnalyticsPage() {
  const { data: locations } = useQuery({ queryKey: ["affected-locations"], queryFn: async () => (await fetchMostAffectedLocations()).data });
  const { data: peaks } = useQuery({ queryKey: ["peak-times"], queryFn: async () => (await fetchPeakTimes(70)).data });

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Most Affected Locations</h2>
        <LocationBarChart data={locations || []} />
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Peak Pollution Times (gas ≥ 70)</h2>
        {peaks?.length ? (
          <ul className="list-disc pl-5">
            {peaks.map((p: any) => (
              <li key={p.id}>{p.device?.device_id} - {p.gas_value} ppm at {new Date(p.timestamp).toLocaleString()}</li>
            ))}
          </ul>
        ) : <p>No peak events found.</p>}
      </div>
    </div>
  );
}