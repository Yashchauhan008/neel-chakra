// src/components/DataChart.js

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DataChart({ data, dataKeys }) {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-8">No data available for the selected period.</div>;
  }

  return (
    // ResponsiveContainer makes the chart adapt to its parent's size
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="date" stroke="#666" fontSize={12} />
        <YAxis stroke="#666" fontSize={12} domain={[0, 1]} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
        />
        <Legend />
        {dataKeys.map(key => (
          <Line
            key={key.name}
            type="monotone"
            dataKey={key.name}
            stroke={key.color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
