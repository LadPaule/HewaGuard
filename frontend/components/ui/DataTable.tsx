export default function LatestReadingsTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Device</th>
            <th className="p-2 text-left">Time</th>
            <th className="p-2 text-right">Gas</th>
            <th className="p-2 text-right">Temp</th>
            <th className="p-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: any) => (
            <tr key={r.id} className="border-t">
              <td className="p-2">{r.device?.device_id || r.device_id}</td>
              <td className="p-2">{new Date(r.timestamp).toLocaleTimeString()}</td>
              <td className="p-2 text-right">{r.gas_value}</td>
              <td className="p-2 text-right">{r.temperature}°C</td>
              <td className="p-2 text-center">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  r.status === "DANGEROUS" ? "bg-red-200 text-red-800" :
                  r.status === "MODERATE" ? "bg-yellow-200 text-yellow-800" :
                  "bg-green-200 text-green-800"
                }`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}