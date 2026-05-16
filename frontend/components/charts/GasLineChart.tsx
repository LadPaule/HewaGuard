import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function GasLineChart({ data }: { data: any[] }) {
  const chartData = data.map((d) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    gas: d.gas_value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="gas" stroke="#2E98D5" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}