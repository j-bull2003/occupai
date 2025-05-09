import React from "react";
import PanelChart from "./PanelChart";
import AnomalyWidget from "./AnomalyWidget";

const Dashboard = ({ data }) => {
  const panels = data.panels || [];

  return (
    <div className="space-y-8 px-4 max-w-screen-xl mx-auto">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {panel.title}
          </h2>

          {/* This flexbox ensures chart is on the left, widget is on the right */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Chart takes up most of the width */}
            <div className="lg:flex-1 min-w-0">
              <PanelChart panel={panel} />
            </div>

            {/* Widget has a fixed width on large screens */}
            <div className="lg:w-80 w-full">
              <AnomalyWidget panel={panel} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
