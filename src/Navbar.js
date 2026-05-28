import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
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
      <button className="logout-btn" onClick={handleLogoutClick} aria-label="Log Out">
        Log Out
      </button>
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </div>
  );
};

export default Navbar;
