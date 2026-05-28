import React from "react";
import Sidebar from "./Sidebar";

const metrics = [
  { id: 1, icon: "fa-cubes", value: "12", label: "Total Containers" },
  { id: 2, icon: "fa-play-circle", value: "8", label: "Running" },
  { id: 3, icon: "fa-layer-group", value: "24", label: "Images" },
  { id: 4, icon: "fa-database", value: "6", label: "Volumes" },
];

const Dashboard = () => {
  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="dashboard-content">
        <div className="metrics-grid">
          {metrics.map((m) => (
            <div className="metric-card" key={m.id}>
              <i className={`fa-solid ${m.icon} metric-icon`}></i>
              <span className="metric-value">{m.value}</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
