// PanelChart.jsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const PanelChart = ({ panel }) => {
  const data = panel.data || [];

  if (!data.length) {
    return <p className="text-gray-500 text-sm">No data available for chart.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        {data.some(d => 'people_count' in d) && (
          <Line
            type="monotone"
            dataKey="people_count"
            stroke="#8884d8"
            name="People Count"
          />
        )}
        {data.some(d => 'group_count' in d) && (
          <Line
            type="monotone"
            dataKey="group_count"
            stroke="#82ca9d"
            name="Group Count"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PanelChart;
