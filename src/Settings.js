import React, { useState } from "react";

const Settings = ({ navigateTo }) => {
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane@example.com");
  const [bio, setBio] = useState("Docker enthusiast and full-stack developer.");

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
            onClick={() => navigateTo("/dashboard")}
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
