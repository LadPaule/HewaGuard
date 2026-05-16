import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LocationBarChart({ data }: { data: { location: string; avg_gas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="avg_gas" fill="#76A92A" name="Avg Gas (ppm)" />
      </BarChart>
    </ResponsiveContainer>
  );
}