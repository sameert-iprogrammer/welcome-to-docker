import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "fa-solid fa-gauge-high" },
    { label: "Orders", path: "/orders", icon: "fa-solid fa-truck" },
    { label: "Customers", path: "/customers", icon: "fa-solid fa-users" },
    { label: "Products", path: "/products", icon: "fa-solid fa-box" },
  ];

  return (
    <div className={`sidebar${collapsed ? " sidebar--collapsed" : ""}`}>
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-nav-item${
              location.pathname === item.path ? " sidebar-nav-item--active" : ""
            }`}
            onClick={() => navigate(item.path)}
            aria-label={item.label}
          >
            <i className={item.icon}></i>
            {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
