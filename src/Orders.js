import React, { useState } from "react";
import Sidebar from "./Sidebar";

const mockOrders = [
  { id: "ORD-001", customer: "Alice Johnson", product: "Docker Desktop", status: "Shipped", date: "2026-05-01" },
  { id: "ORD-002", customer: "Bob Smith", product: "Docker Compose", status: "Processing", date: "2026-05-10" },
  { id: "ORD-003", customer: "Carol White", product: "Docker Hub", status: "Delivered", date: "2026-04-28" },
  { id: "ORD-004", customer: "Dave Brown", product: "Docker Engine", status: "Pending", date: "2026-05-15" },
  { id: "ORD-005", customer: "Eve Davis", product: "Docker Swarm", status: "Shipped", date: "2026-05-12" },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = mockOrders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.customer.toLowerCase().includes(term) ||
      order.product.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.date.toLowerCase().includes(term)
    );
  });

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="orders-container">
        <h2 className="orders-title">Orders</h2>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search orders"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">ID</th>
                <th className="orders-table-th">Customer</th>
                <th className="orders-table-th">Product</th>
                <th className="orders-table-th">Status</th>
                <th className="orders-table-th">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="orders-table-td">{order.id}</td>
                  <td className="orders-table-td">{order.customer}</td>
                  <td className="orders-table-td">{order.product}</td>
                  <td className="orders-table-td">{order.status}</td>
                  <td className="orders-table-td">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <p className="orders-no-results">No orders found matching "{searchTerm}"</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
