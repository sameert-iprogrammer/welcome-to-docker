import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      toast.success(`Welcome, ${data.firstName}!`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during login.");
    } finally {
      setLoading(false);
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
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="login-submit-btn"
            aria-label="Sign In"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
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
          <div className="register-link">
            <span
              className="register-link-action"
              onClick={() => navigate("/privacy")}
              role="button"
              tabIndex={0}
              aria-label="View Privacy Policy"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/privacy");
                }
              }}
            >
              Privacy Policy
            </span>
          </div>
          <div className="register-link">
            <span
              className="register-link-action"
              onClick={() => navigate("/terms")}
              role="button"
              tabIndex={0}
              aria-label="View Terms and Conditions"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/terms");
                }
              }}
            >
              Terms and Conditions
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
