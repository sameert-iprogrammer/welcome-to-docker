import React, { useState } from "react";

const Register = ({ navigateTo }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = ["Name is required"];
    }

    if (!email.trim()) {
      newErrors.email = ["Email is required"];
    } else if (!validateEmail(email)) {
      newErrors.email = ["Please enter a valid email address"];
    }

    const passwordViolations = validatePassword(password);
    if (passwordViolations.length > 0) {
      newErrors.password = passwordViolations;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const existingUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );
      existingUsers.push({ name, email, password });
      localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));
      navigateTo("/login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="docker-logo-icon">🐳</div>
          <h2>Create Account</h2>
          <p>Register to get started with Docker</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Full Name"
              className="login-input"
            />
            {errors.name &&
              errors.name.map((msg, i) => (
                <div key={i} className="validation-error">
                  {msg}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email Address"
              className="login-input"
            />
            {errors.email &&
              errors.email.map((msg, i) => (
                <div key={i} className="validation-error">
                  {msg}
                </div>
              ))}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
              className="login-input"
            />
            <span className="password-hint">
              Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
            </span>
            {errors.password &&
              errors.password.map((msg, i) => (
                <div key={i} className="validation-error">
                  {msg}
                </div>
              ))}
          </div>
          <button
            type="submit"
            className="login-submit-btn"
            aria-label="Create Account"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
