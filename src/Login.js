import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Signed in successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="docker-logo-icon">🐳</div>
          <h2>Welcome to Docker</h2>
          <p>Sign in to access your dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
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
          </div>
          <button type="submit" className="login-submit-btn" aria-label="Sign In">
            Sign In
          </button>
          <div className="register-link">
            Don't have an account?{" "}
            <span
              className="register-link-action"
              onClick={() => navigate("/register")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/register");
                }
              }}
            >
              Register
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
