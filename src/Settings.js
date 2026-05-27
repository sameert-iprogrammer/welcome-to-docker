import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane@example.com");
  const [bio, setBio] = useState("Docker enthusiast and full-stack developer.");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  const validateNewPassword = (value) => {
    const violations = [];
    if (value.length < 8) {
      violations.push("Must be at least 8 characters");
    }
    if (!/(?=.*[a-z])/.test(value)) {
      violations.push("Must contain 1 lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      violations.push("Must contain 1 uppercase letter");
    }
    if (!/(?=.*\d)/.test(value)) {
      violations.push("Must contain 1 digit");
    }
    if (!/(?=.*[!@#$%^&*()_\-+=])/.test(value)) {
      violations.push("Must contain 1 special character");
    }
    return violations;
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = ["Current password is required"];
    }

    const newPasswordViolations = validateNewPassword(newPassword);
    if (newPasswordViolations.length > 0) {
      newErrors.newPassword = newPasswordViolations;
    }
    if (newPassword && newPassword === currentPassword) {
      newErrors.newPassword = [
        ...(newErrors.newPassword || []),
        "Must differ from current password",
      ];
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = ["Please confirm your new password"];
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = ["Passwords do not match"];
    }

    setPasswordErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="docker-logo-icon">🐳</div>
          <h2>Settings</h2>
          <p>Manage your profile settings</p>
        </div>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="settings-name">Full Name</label>
            <input
              id="settings-name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Full Name"
              className="login-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="settings-email">Email Address</label>
            <input
              id="settings-email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email Address"
              className="login-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="settings-bio">Bio</label>
            <textarea
              id="settings-bio"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              aria-label="Bio"
              className="login-input settings-textarea"
            />
          </div>
          <button
            type="button"
            className="settings-back-btn"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="login-form">
          <h3>Change Password</h3>
          <div className="form-group">
            <label htmlFor="settings-current-password">Current Password</label>
            <input
              id="settings-current-password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              aria-label="Current Password"
              autoComplete="current-password"
              className="login-input"
            />
            {passwordErrors.currentPassword &&
              passwordErrors.currentPassword.map((msg, i) => (
                <div key={i} className="validation-error">
                  {msg}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="settings-new-password">New Password</label>
            <input
              id="settings-new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              aria-label="New Password"
              autoComplete="new-password"
              className="login-input"
            />
            <span className="password-hint">
              Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
            </span>
            {passwordErrors.newPassword &&
              passwordErrors.newPassword.map((msg, i) => (
                <div key={i} className="validation-error">
                  {msg}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="settings-confirm-password">
              Confirm New Password
            </label>
            <input
              id="settings-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-label="Confirm New Password"
              autoComplete="new-password"
              className="login-input"
            />
            {passwordErrors.confirmPassword &&
              passwordErrors.confirmPassword.map((msg, i) => (
                <div key={i} className="validation-error">
                  {msg}
                </div>
              ))}
          </div>
          <button
            type="submit"
            className="login-submit-btn"
            aria-label="Change Password"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
