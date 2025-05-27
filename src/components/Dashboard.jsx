import React, { useEffect, useState } from 'react';
import { fetchInfluxData } from './fetchInfluxData';
import PanelChart from './PanelChart';
import AnomalyWidget from './AnomalyWidget';

const Dashboard = () => {
  const [panelData, setPanelData] = useState([]);

  useEffect(() => {
    fetchInfluxData().then(setPanelData).catch(console.error);
  }, []);

  // Simulate panel structure from your Grafana config
  const panel = {
    id: 1,
    title: 'Occupancy Panel',
    data: panelData
  };

  return (
    <div className="space-y-8 px-4 max-w-screen-xl mx-auto">
      <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{panel.title}</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:flex-1 min-w-0">
            <PanelChart panel={panel} />
          </div>
          <div className="lg:w-80 w-full">
            <AnomalyWidget panel={panel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
