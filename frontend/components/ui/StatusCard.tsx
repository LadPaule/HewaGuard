interface StatusCardProps {
  reading: {
    id: number;
    device_id: number;
    timestamp: string;
    gas_value: number;
    temperature: number;
    status: "SAFE" | "MODERATE" | "DANGEROUS";
    device?: {
      device_id: string;
      location: string;
    };
  };
}

export default function StatusCard({ reading }: StatusCardProps) {
  const validDate = reading.timestamp && !isNaN(new Date(reading.timestamp).getTime());
  const statusColor =
    reading.status === "DANGEROUS"
      ? "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      : reading.status === "MODERATE"
      ? "bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      : "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-300";

  return (
    <div className={`p-4 rounded-lg shadow border-l-4 ${statusColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold">{reading.device?.device_id || `Device #${reading.device_id}`}</p>
          <p className="text-sm opacity-75">{reading.device?.location || "Unknown"}</p>
        </div>
        <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-white/50 dark:bg-black/20">
          {reading.status}
        </span>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span>Gas: {reading.gas_value} ppm</span>
        <span>Temp: {reading.temperature}°C</span>
      </div>
      <p className="text-xs mt-2 opacity-75">
        {validDate ? new Date(reading.timestamp).toLocaleTimeString() : "No date"}
      </p>
    </div>
  );
}