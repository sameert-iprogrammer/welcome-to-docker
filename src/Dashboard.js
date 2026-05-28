import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const metrics = [
  { id: 1, icon: "fa-cubes", value: "12", label: "Total Containers" },
  { id: 2, icon: "fa-play-circle", value: "8", label: "Running" },
  { id: 3, icon: "fa-layer-group", value: "24", label: "Images" },
  { id: 4, icon: "fa-database", value: "6", label: "Volumes" },
];

const leaderboard = [
  { rank: 1, name: "Captain Whale", containers: 42, points: 9850, badge: "🐳" },
  { rank: 2, name: "Docker Dynamo", containers: 38, points: 9200, badge: "🐋" },
  { rank: 3, name: "Container King", containers: 35, points: 8750, badge: "🐬" },
  { rank: 4, name: "Stack Surfer", containers: 29, points: 7400, badge: "🦈" },
  { rank: 5, name: "Image Artist", containers: 24, points: 6200, badge: "🐠" },
  { rank: 6, name: "Volume Voyager", containers: 18, points: 4800, badge: "🐙" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="dashboard-content">
        <div className="dashboard-nav">
          <button
            className="profile-btn"
            onClick={() => navigate("/profile")}
            aria-label="View profile"
          >
            <i className="fa-solid fa-circle-user"></i>
          </button>
          <button className="settings-btn" onClick={() => navigate("/settings")} aria-label="Settings">
            <i className="fa-solid fa-gear"></i>
          </button>
          <button className="logout-btn" onClick={handleLogout} aria-label="Log Out">
            Log Out
          </button>
        </div>

        <div className="metrics-grid">
          {metrics.map((m) => (
            <div className="metric-card" key={m.id}>
              <i className={`fa-solid ${m.icon} metric-icon`}></i>
              <span className="metric-value">{m.value}</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>

        <h2 className="leaderboard-title">Leaderboard</h2>
        <div className="leaderboard-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th className="leaderboard-table-th">Rank</th>
                <th className="leaderboard-table-th">User</th>
                <th className="leaderboard-table-th">Containers</th>
                <th className="leaderboard-table-th">Points</th>
                <th className="leaderboard-table-th">Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank}>
                  <td className="leaderboard-table-td">
                    {entry.rank === 1 && <i className="fa-solid fa-trophy" style={{ color: "#ffd700", marginRight: 6 }}></i>}
                    {entry.rank}
                  </td>
                  <td className="leaderboard-table-td">{entry.name}</td>
                  <td className="leaderboard-table-td">{entry.containers}</td>
                  <td className="leaderboard-table-td">{entry.points.toLocaleString()}</td>
                  <td className="leaderboard-table-td"><span className="badge-icon">{entry.badge}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
