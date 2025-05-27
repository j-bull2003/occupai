// AnomalyWidget.jsx
import React from 'react';

const AnomalyWidget = ({ panel }) => {
  const data = panel.data || [];

  if (!data.length) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
        <p className="text-gray-700 text-sm">No data available for anomaly detection.</p>
      </div>
    );
  }

  const validEntries = data.filter(d => typeof d.people_count === 'number');

  if (!validEntries.length) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
        <p className="text-gray-700 text-sm">No people_count data available.</p>
      </div>
    );
  }

  const maxEntry = validEntries.reduce((max, curr) =>
    curr.people_count > max.people_count ? curr : max
  );
  const minEntry = validEntries.reduce((min, curr) =>
    curr.people_count < min.people_count ? curr : min
  );

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner space-y-2">
      <h3 className="font-semibold text-gray-800">Anomaly Insights</h3>
      <p className="text-gray-700 text-sm">
        🟢 Max occupancy: <strong>{maxEntry.people_count}</strong> people at{' '}
        <strong>{new Date(maxEntry.time).toLocaleTimeString()}</strong>
      </p>
      <p className="text-gray-700 text-sm">
        🔵 Min occupancy: <strong>{minEntry.people_count}</strong> people at{' '}
        <strong>{new Date(minEntry.time).toLocaleTimeString()}</strong>
      </p>
    </div>
  );
};

export default AnomalyWidget;
