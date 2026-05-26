import React, { useState } from "react";

const Sidebar = ({ navigateTo, currentPath }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: "fa-solid fa-gauge-high" },
    { label: "Orders", path: "/orders", icon: "fa-solid fa-truck" },
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
              currentPath === item.path ? " sidebar-nav-item--active" : ""
            }`}
            onClick={() => navigateTo(item.path)}
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
