import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Customers from "./Customers";
import Products from "./Products";
import Settings from "./Settings";
import Profile from "./Profile";
import FAQ from "./FAQ";
import Navbar from "./Navbar";

const App = () => {
  // Subscribe to location changes so isAuthenticated is re-evaluated on navigation
  useLocation();
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="light"
      />
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? <Settings /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/orders"
          element={
            isAuthenticated ? <Orders /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/customers"
          element={
            isAuthenticated ? <Customers /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/products"
          element={
            isAuthenticated ? <Products /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/faq"
          element={
            isAuthenticated ? <FAQ /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
