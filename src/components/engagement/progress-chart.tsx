"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { week: "W1", score: 42 },
  { week: "W2", score: 51 },
  { week: "W3", score: 58 },
  { week: "W4", score: 67 },
  { week: "W5", score: 74 }
];

export function ProgressChart() {
  return (
    <div className="h-64 rounded-xl border bg-card p-3">
      <p className="mb-2 text-sm font-semibold">Career Progress Trend</p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#00BCD4" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
