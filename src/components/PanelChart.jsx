import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import Papa from "papaparse";

const parseCSVData = (csv, columns) => {
  const result = Papa.parse(csv.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  return result.data.map((row) => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.selector] =
        col.type === "number"
          ? parseFloat(row[col.selector])
          : row[col.selector];
    });
    return newRow;
  });
};

const PanelChart = ({ panel }) => {
  const target = panel.targets.find((t) => t.data);
  if (!target) return <p className="text-gray-400">No data available</p>;

  const columns = target.columns;
  const data = parseCSVData(target.data, columns);

  const chartType = panel.type;
  const valueKey = columns.find((col) => col.type === "number")?.selector;
  const timeKey = columns.find((col) => col.type === "timestamp")?.selector;

  return (
    <ResponsiveContainer width="100%" height={250}>
      {chartType === "timeseries" ? (
        <LineChart data={data}>
          <XAxis dataKey={timeKey} tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={valueKey} stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      ) : chartType === "bargauge" || chartType === "gauge" ? (
        <BarChart data={data}>
          <XAxis dataKey={timeKey} tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={valueKey} fill="#10b981" />
        </BarChart>
      ) : (
        <p className="text-gray-400">Unsupported chart type</p>
      )}
    </ResponsiveContainer>
  );
};

export default PanelChart;
