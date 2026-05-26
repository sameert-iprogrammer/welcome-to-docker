import React from "react";
import mockProfile from "./mockProfile";

const Profile = ({ navigateTo }) => {
  const { displayName, email, username, avatarUrl, role, memberSince, bio } =
    mockProfile;

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="docker-logo-icon">🐳</div>
          <h2>Profile</h2>
          <p>Your account information</p>
        </div>
        <div className="profile-details">
          <div className="profile-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} />
            ) : (
              <span className="profile-avatar-initials" aria-hidden="true">
                {initials}
              </span>
            )}
          </div>
          <dl className="profile-fields">
            <div className="profile-field">
              <dt>Full Name</dt>
              <dd className="profile-value">{displayName}</dd>
            </div>
            <div className="profile-field">
              <dt>Email</dt>
              <dd className="profile-value">{email}</dd>
            </div>
            <div className="profile-field">
              <dt>Username</dt>
              <dd className="profile-value">{username}</dd>
            </div>
            <div className="profile-field">
              <dt>Role</dt>
              <dd className="profile-value">{role}</dd>
            </div>
            <div className="profile-field">
              <dt>Member Since</dt>
              <dd className="profile-value">{memberSince}</dd>
            </div>
            <div className="profile-field">
              <dt>Bio</dt>
              <dd className="profile-value">{bio}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="settings-back-btn"
            onClick={() => navigateTo("/dashboard")}
            aria-label="Back to Dashboard"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
