import React from "react";
import Sidebar from "./Sidebar";
import { mockActiveSessions } from "./activeSessionsMock";

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
        <div className="dashboard-sessions">
          <h2 className="orders-title">Active Sessions</h2>
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th className="orders-table-th">User</th>
                  <th className="orders-table-th">Status</th>
                  <th className="orders-table-th">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {mockActiveSessions.map((session) => (
                  <tr key={session.id}>
                    <td className="orders-table-td">{session.user}</td>
                    <td className="orders-table-td">{session.status}</td>
                    <td className="orders-table-td">{session.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
