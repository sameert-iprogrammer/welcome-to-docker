import React from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "./Confetti";
import Sidebar from "./Sidebar";

const shareMessage = "I just ran my first container using Docker";
const shareLink = "https://docker.com/";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="dashboard-content">
        <Confetti />
        
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

        <header className="App-header">
          <h1 style={{ marginBottom: "0px" }}>Congratulations!!!</h1>
          <p style={{ marginTop: "10px", marginBottom: "50px" }}>
            You ran your first container.
          </p>
          <div className="social-links">
            <a
              target="_blank"
              href={
                "https://twitter.com/intent/tweet?text=" +
                encodeURIComponent(shareMessage) +
                "&url=" +
                encodeURIComponent(shareLink)
              }
              className="fa-brands fa-x-twitter"
              rel="noopener noreferrer"
              aria-label="Share on X"
            >
              {" "}
            </a>
            <a
              target="_blank"
              href={
                "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(shareLink)
              }
              className="fa-brands fa-linkedin"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
            >
              {" "}
            </a>
            <a
              target="_blank"
              href={
                "https://reddit.com/submit?title=" +
                encodeURIComponent(shareMessage) +
                "&url=" +
                encodeURIComponent(shareLink)
              }
              className="fa-brands fa-reddit"
              rel="noopener noreferrer"
              aria-label="Share on Reddit"
            >
              {" "}
            </a>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
