import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Login from "./Login";
import Dashboard from "./Dashboard";

const App = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  // Expose action to update route path on client side
  const navigateTo = useCallback((path) => {
    window.history.pushState({}, "", path);
    setPathname(path);
  }, []);

  // Listen to standard browser back/forward (history navigation)
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Enforce route guard logic
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      if (pathname !== "/login") {
        navigateTo("/login");
      }
    } else {
      if (pathname === "/login" || pathname === "/") {
        navigateTo("/dashboard");
      }
    }
  }, [pathname, isAuthenticated, navigateTo]);

  // Determine what view to render based on authentication status
  const renderView = () => {
    if (!isAuthenticated) {
      return <Login onLoginSuccess={() => navigateTo("/dashboard")} />;
    }
    return <Dashboard onLogout={() => navigateTo("/login")} />;
  };

  return <div className="App">{renderView()}</div>;
};

export default App;

