import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PredictionPoint {
  ds: string;
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

export default function PredictionChart({ data }: { data: PredictionPoint[] }) {
  const chartData = data.map((d) => ({
    time: new Date(d.ds).toLocaleTimeString(),
    prediction: d.yhat,
    lower: d.yhat_lower,
    upper: d.yhat_upper,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="prediction" stroke="#2E98D5" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="lower" stroke="#76A92A" strokeWidth={1} dot={false} strokeDasharray="5 5" />
        <Line type="monotone" dataKey="upper" stroke="#76A92A" strokeWidth={1} dot={false} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
}