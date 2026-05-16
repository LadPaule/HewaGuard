interface StatusCardProps {
  reading: {
    device_id: number;
    device?: { device_id: string; location: string };
    gas_value: number;
    temperature: number;
    status: string;
    timestamp: string;
  };
}

export default function StatusCard({ reading }: StatusCardProps) {
  const statusColor =
    reading.status === "DANGEROUS"
      ? "bg-red-100 border-red-500 text-red-800"
      : reading.status === "MODERATE"
      ? "bg-yellow-100 border-yellow-500 text-yellow-800"
      : "bg-green-100 border-green-500 text-green-800";

  return (
    <div className={`p-4 rounded-lg shadow border-l-4 ${statusColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{reading.device?.device_id || `Device #${reading.device_id}`}</p>
          <p className="text-sm">{reading.device?.location || "Unknown"}</p>
        </div>
        <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-white/50">
          {reading.status}
        </span>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span>Gas: {reading.gas_value} ppm</span>
        <span>Temp: {reading.temperature}°C</span>
      </div>
      <p className="text-xs mt-2 opacity-75">
        {new Date(reading.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
}