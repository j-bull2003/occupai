// src/components/AnomalyWidget.jsx
import React from "react";
import Papa from "papaparse";

const getAnomalies = (panel) => {
  const target = panel.targets.find((t) => t.data);
  if (!target) return [];

  const columns = target.columns;
  const data = Papa.parse(target.data.trim(), {
    header: true,
    skipEmptyLines: true
  }).data;

  const valueKey = columns.find((col) => col.type === "number")?.selector;

  const values = data.map((row) => parseFloat(row[valueKey])).filter((v) => !isNaN(v));
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const std = Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / values.length);

  const anomalies = values.map((v, i) => {
    const z = (v - mean) / (std || 1);
    return Math.abs(z) > 2 ? { index: i, value: v, z } : null;
  }).filter(Boolean);

  return anomalies.slice(0, 5);
};

const AnomalyWidget = ({ panel }) => {
  const anomalies = getAnomalies(panel);
  if (anomalies.length === 0) return null;

  return (
    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm">
      <h3 className="text-yellow-800 font-semibold mb-2">Anomalies Detected</h3>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        {anomalies.map((a, i) => (
          <li key={i}>
            Point {a.index + 1}: {a.value.toFixed(2)} (z: {a.z.toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnomalyWidget;
