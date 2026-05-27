import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import mockProfile from "./mockProfile";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(mockProfile);

  const { displayName, email, username, avatarUrl, role, memberSince, bio } =
    profile;

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field) => (e) =>
    setDraft((prev) => ({ ...prev, [field]: e.target.value }));

  const handleUpdate = (e) => {
    e.preventDefault();
    setProfile(draft);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="docker-logo-icon">🐳</div>
          <h2>Profile</h2>
          <p>
            {isEditing
              ? "Update your account information"
              : "Your account information"}
          </p>
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
          {!isEditing ? (
            <>
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
              <div className="profile-actions">
                <button
                  type="button"
                  className="login-submit-btn"
                  onClick={handleEdit}
                  aria-label="Edit profile"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  className="settings-back-btn"
                  onClick={() => navigate("/dashboard")}
                  aria-label="Back to Dashboard"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </>
          ) : (
            <form className="login-form" onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="profile-fullname">Full Name</label>
                <input
                  id="profile-fullname"
                  type="text"
                  value={draft.displayName}
                  onChange={handleChange("displayName")}
                  aria-label="Full Name"
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={draft.email}
                  onChange={handleChange("email")}
                  aria-label="Email"
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profile-username">Username</label>
                <input
                  id="profile-username"
                  type="text"
                  value={draft.username}
                  onChange={handleChange("username")}
                  aria-label="Username"
                  className="login-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="profile-bio">Bio</label>
                <textarea
                  id="profile-bio"
                  value={draft.bio}
                  onChange={handleChange("bio")}
                  aria-label="Bio"
                  className="login-input settings-textarea"
                />
              </div>
              <div className="profile-actions">
                <button
                  type="submit"
                  className="login-submit-btn"
                  aria-label="Update profile"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="settings-back-btn"
                  onClick={handleCancel}
                  aria-label="Cancel edit"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
