import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const metrics = [
  { id: 1, icon: "fa-cubes", value: "12", label: "Total Containers" },
  { id: 2, icon: "fa-play-circle", value: "8", label: "Running" },
  { id: 3, icon: "fa-layer-group", value: "24", label: "Images" },
  { id: 4, icon: "fa-database", value: "6", label: "Volumes" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const payload = decodeJwtPayload(token);
    if (payload) {
      setUserName(`${payload.firstName || ""} ${payload.lastName || ""}`.trim());
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="dashboard-content">
        <h2 className="dashboard-welcome">
          Welcome{userName ? `, ${userName}` : ""}!
        </h2>
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
