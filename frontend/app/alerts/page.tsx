"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "@/lib/api";

export default function AlertsPage() {
  const { data: alerts } = useQuery({ queryKey: ["alerts"], queryFn: async () => (await fetchAlerts(50)).data });

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-2 text-left">Device</th>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Message</th>
              <th className="p-2 text-center">Resolved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {alerts?.map((a: any) => (
              <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2">{a.device?.device_id || a.device_id}</td>
                <td className="p-2">{new Date(a.created_at).toLocaleString()}</td>
                <td className="p-2">{a.message}</td>
                <td className="p-2 text-center">{a.resolved ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}