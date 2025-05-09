import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load data.json", err));
  }, []);

  if (!data) return <p className="text-gray-600">Loading dashboard...</p>;

  return (
    <div className="w-full max-w-screen-xl">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        OccupAI Dashboard
      </h1>
      <Dashboard data={data} />
    </div>
  );
}

export default App;
