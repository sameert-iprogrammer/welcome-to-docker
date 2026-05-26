import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Settings from "./Settings";
import Profile from "./Profile";

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
      if (pathname !== "/login" && pathname !== "/register") {
        navigateTo("/login");
      }
    } else {
      if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/"
      ) {
        navigateTo("/dashboard");
      }
    }
  }, [pathname, isAuthenticated, navigateTo]);

  // Determine what view to render based on authentication status
  const renderView = () => {
    if (!isAuthenticated) {
      if (pathname === "/register") {
        return <Register navigateTo={navigateTo} />;
      }
      return <Login onLoginSuccess={() => navigateTo("/dashboard")} navigateTo={navigateTo} />;
    }
    if (pathname === "/settings") {
      return <Settings navigateTo={navigateTo} />;
    }
    if (pathname === "/profile") {
      return <Profile navigateTo={navigateTo} />;
    }
    if (pathname === "/orders") {
      return <Orders navigateTo={navigateTo} />;
    }
    return <Dashboard onLogout={() => navigateTo("/login")} navigateTo={navigateTo} />;
  };

  return <div className="App">{renderView()}</div>;
};

export default App;

