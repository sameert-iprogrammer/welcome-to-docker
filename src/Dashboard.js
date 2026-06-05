import React, { useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const metrics = [
  { id: 1, icon: "fa-cubes", value: "12", label: "Total Containers" },
  { id: 2, icon: "fa-play-circle", value: "8", label: "Running" },
  { id: 3, icon: "fa-layer-group", value: "24", label: "Images" },
  { id: 4, icon: "fa-database", value: "6", label: "Volumes" },
];

const recentUsersData = [
  { id: 1, username: "alice_w", email: "alice@example.com", role: "Admin", status: "Active", joinedDate: "2024-01-15" },
  { id: 2, username: "bob_dev", email: "bob@example.com", role: "Developer", status: "Active", joinedDate: "2024-03-22" },
  { id: 3, username: "carol_m", email: "carol@example.com", role: "Viewer", status: "Inactive", joinedDate: "2024-06-10" },
  { id: 4, username: "dan_ops", email: "dan@example.com", role: "Operator", status: "Active", joinedDate: "2024-09-05" },
  { id: 5, username: "eve_eng", email: "eve@example.com", role: "Developer", status: "Inactive", joinedDate: "2024-11-18" },
];

const recentOrdersData = [
  { id: "ORD-001", customer: "Alice Johnson", product: "Docker Desktop", status: "Shipped", date: "2026-05-01" },
  { id: "ORD-002", customer: "Bob Smith", product: "Docker Compose", status: "Processing", date: "2026-05-10" },
  { id: "ORD-003", customer: "Carol White", product: "Docker Hub", status: "Delivered", date: "2026-04-28" },
  { id: "ORD-004", customer: "Dave Brown", product: "Docker Engine", status: "Pending", date: "2026-05-15" },
  { id: "ORD-005", customer: "Eve Davis", product: "Docker Swarm", status: "Shipped", date: "2026-05-12" },
];

const Dashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [users, setUsers] = useState(recentUsersData);
  const [confirmUser, setConfirmUser] = useState(null);

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers(prev => prev.map(u => u.id === user.id ? {...u, status: newStatus} : u));
    setConfirmUser(null);
    toast.success(`${user.username} marked as ${newStatus}`);
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="dashboard-content">
        <div className="metrics-grid">
          {metrics.map((m) => (
            <div className="metric-card" key={m.id}>
              <i className={`fa-solid ${m.icon} metric-icon`}></i>
              <span className="metric-value">{m.value}</span>
              <span className="metric-label">{m.label}</span>
            </div>
          ))}
        </div>
        <section className="recent-users-section">
          <h2 className="recent-users-title">Recent Users</h2>
          <div className="recent-users-table-wrapper">
            <table className="recent-users-table">
              <thead>
                <tr>
                  <th className="recent-users-table-th">Username</th>
                  <th className="recent-users-table-th">Email</th>
                  <th className="recent-users-table-th">Role</th>
                  <th className="recent-users-table-th">Status</th>
                  <th className="recent-users-table-th">Joined Date</th>
                  <th className="recent-users-table-th">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="recent-users-table-td">{u.username}</td>
                    <td className="recent-users-table-td">{u.email}</td>
                    <td className="recent-users-table-td">{u.role}</td>
                    <td className="recent-users-table-td">
                      <span className={`recent-users-status recent-users-status--${u.status.toLowerCase()}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="recent-users-table-td">{u.joinedDate}</td>
                    <td className="recent-users-table-td">
                      <div style={{display:"flex",gap:"8px"}}>
                        <button className="recent-users-view-btn" onClick={() => setSelectedUser(u)} aria-label={`View ${u.username}`}>View</button>
                        <button className={`recent-users-mark-btn recent-users-mark-btn--${u.status === "Active" ? "inactivate" : "activate"}`} onClick={() => setConfirmUser(u)}>
                          {u.status === "Active" ? "Mark Inactive" : "Mark Active"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedUser && (
            <div className="recent-users-modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedUser(null)}>
              <div className="recent-users-modal" onClick={(e) => e.stopPropagation()}>
                <div className="recent-users-modal-header">
                  <h3 className="recent-users-modal-title">User Details</h3>
                  <button className="recent-users-modal-close-btn" onClick={() => setSelectedUser(null)} aria-label="Close">&times;</button>
                </div>
                <div className="recent-users-modal-body">
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Username</span>
                    <span className="recent-users-modal-value">{selectedUser.username}</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Email</span>
                    <span className="recent-users-modal-value">{selectedUser.email}</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Role</span>
                    <span className="recent-users-modal-value">{selectedUser.role}</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Status</span>
                    <span className="recent-users-modal-value">{selectedUser.status}</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Joined Date</span>
                    <span className="recent-users-modal-value">{selectedUser.joinedDate}</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Last Active</span>
                    <span className="recent-users-modal-value">Today, 09:15 AM</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">User ID</span>
                    <span className="recent-users-modal-value">USR-{selectedUser.id}</span>
                  </div>
                  <div className="recent-users-modal-row">
                    <span className="recent-users-modal-label">Department</span>
                    <span className="recent-users-modal-value">Engineering</span>
                  </div>
                </div>
                <div className="recent-users-modal-actions">
                  <button className="recent-users-modal-close-action-btn" onClick={() => setSelectedUser(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
          {confirmUser && (
            <div className="confirm-dialog-overlay" onClick={() => setConfirmUser(null)}>
              <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                <h3 className="confirm-dialog-title">Confirm Status Change</h3>
                <p className="confirm-dialog-message">Are you sure you want to mark {confirmUser.username} as {confirmUser.status === "Active" ? "Inactive" : "Active"}?</p>
                <div className="confirm-dialog-actions">
                  <button className="confirm-dialog-cancel-btn" onClick={() => setConfirmUser(null)}>Cancel</button>
                  <button className="confirm-dialog-confirm-btn" onClick={() => handleToggleStatus(confirmUser)}>Confirm</button>
                </div>
              </div>
            </div>
          )}
        </section>
        <section className="recent-orders-section">
          <h2 className="recent-orders-title">Recent Orders</h2>
          <div className="recent-orders-table-wrapper">
            <table className="recent-orders-table">
              <thead>
                <tr>
                  <th className="recent-orders-table-th">Order ID</th>
                  <th className="recent-orders-table-th">Customer</th>
                  <th className="recent-orders-table-th">Product</th>
                  <th className="recent-orders-table-th">Status</th>
                  <th className="recent-orders-table-th">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersData.map((o) => (
                  <tr key={o.id} onClick={() => setSelectedOrder(o)} style={{cursor: 'pointer'}}>
                    <td className="recent-orders-table-td">{o.id}</td>
                    <td className="recent-orders-table-td">{o.customer}</td>
                    <td className="recent-orders-table-td">{o.product}</td>
                    <td className="recent-orders-table-td">
                      <span className={`recent-orders-status recent-orders-status--${o.status.toLowerCase()}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="recent-orders-table-td">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedOrder && (
            <div className="recent-orders-modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedOrder(null)}>
              <div className="recent-orders-modal" onClick={(e) => e.stopPropagation()}>
                <div className="recent-orders-modal-header">
                  <h3 className="recent-orders-modal-title">Order Details</h3>
                  <button className="recent-orders-modal-close-btn" onClick={() => setSelectedOrder(null)} aria-label="Close">&times;</button>
                </div>
                <div className="recent-orders-modal-body">
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Order ID</span>
                    <span className="recent-orders-modal-value">{selectedOrder.id}</span>
                  </div>
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Customer</span>
                    <span className="recent-orders-modal-value">{selectedOrder.customer}</span>
                  </div>
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Product</span>
                    <span className="recent-orders-modal-value">{selectedOrder.product}</span>
                  </div>
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Status</span>
                    <span className="recent-orders-modal-value">{selectedOrder.status}</span>
                  </div>
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Date</span>
                    <span className="recent-orders-modal-value">{selectedOrder.date}</span>
                  </div>
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Amount</span>
                    <span className="recent-orders-modal-value">$49.99</span>
                  </div>
                  <div className="recent-orders-modal-row">
                    <span className="recent-orders-modal-label">Payment Method</span>
                    <span className="recent-orders-modal-value">Credit Card</span>
                  </div>
                </div>
                <div className="recent-orders-modal-actions">
                  <button className="recent-orders-modal-close-action-btn" onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
