import React, { useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import ConfirmDialog from "./ConfirmDialog";

const mockOrders = [
  { id: "ORD-001", customer: "Alice Johnson", product: "Docker Desktop", status: "Shipped", date: "2026-05-01" },
  { id: "ORD-002", customer: "Bob Smith", product: "Docker Compose", status: "Processing", date: "2026-05-10" },
  { id: "ORD-003", customer: "Carol White", product: "Docker Hub", status: "Delivered", date: "2026-04-28" },
  { id: "ORD-004", customer: "Dave Brown", product: "Docker Engine", status: "Pending", date: "2026-05-15" },
  { id: "ORD-005", customer: "Eve Davis", product: "Docker Swarm", status: "Shipped", date: "2026-05-12" },
];

const emptyForm = {
  id: "",
  customer: "",
  product: "",
  status: "Pending",
  date: "",
};

const getNextOrderId = (orders) => {
  const nums = orders.map((o) => {
    const m = o.id.match(/^ORD-(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  });
  const max = nums.length ? Math.max(...nums) : 0;
  return `ORD-${String(max + 1).padStart(3, "0")}`;
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState(mockOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(term) ||
      order.customer.toLowerCase().includes(term) ||
      order.product.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.date.toLowerCase().includes(term)
    );
  });

  const handleOpenModal = () => {
    setForm(emptyForm);
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order) => {
    setForm({ ...order });
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteClick = (order) => setOrderToDelete(order);

  const handleConfirmDelete = () => {
    setOrders((prev) => prev.filter((o) => o.id !== orderToDelete.id));
    setOrderToDelete(null);
    toast.success("Order deleted successfully");
  };

  const handleCancelDelete = () => setOrderToDelete(null);

  const handleFormChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === editingOrder.id ? { ...o, ...form } : o
        )
      );
      setIsModalOpen(false);
      toast.success("Order updated successfully");
    } else {
      const newId = getNextOrderId(orders);
      const { id: _id, ...fields } = form;
      setOrders((prev) => [...prev, { id: newId, ...fields }]);
      setIsModalOpen(false);
      toast.success("Order added successfully");
    }
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="orders-container">
        <div className="orders-header">
          <h2 className="orders-title">Orders</h2>
          <button
            type="button"
            className="customers-add-btn"
            onClick={handleOpenModal}
            aria-label="Add order"
          >
            Add Order
          </button>
        </div>
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
                <th className="orders-table-th">Actions</th>
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
                  <td className="orders-table-td">
                    <button
                      type="button"
                      className="masters-edit-btn"
                      onClick={() => handleEdit(order)}
                      aria-label={`Edit order ${order.id}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="masters-delete-btn"
                      onClick={() => handleDeleteClick(order)}
                      aria-label={`Delete order ${order.id}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <p className="orders-no-results">No orders found matching "{searchTerm}"</p>
        )}
        {isModalOpen && (
          <div
            className="orders-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={editingOrder ? "Edit Order" : "Add Order"}
          >
            <div className="orders-modal">
              <h3 className="orders-modal-title">
                {editingOrder ? "Edit Order" : "Add Order"}
              </h3>
              <form className="orders-modal-form" onSubmit={handleSave}>
                {editingOrder && (
                  <div className="form-group">
                    <label htmlFor="order-id">ID</label>
                    <input
                      id="order-id"
                      type="text"
                      className="login-input"
                      value={form.id}
                      readOnly
                      disabled
                      aria-label="ID"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="order-customer">Customer</label>
                  <input
                    id="order-customer"
                    type="text"
                    className="login-input"
                    value={form.customer}
                    onChange={handleFormChange("customer")}
                    aria-label="Customer"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="order-product">Product</label>
                  <input
                    id="order-product"
                    type="text"
                    className="login-input"
                    value={form.product}
                    onChange={handleFormChange("product")}
                    aria-label="Product"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="order-status">Status</label>
                  <select
                    id="order-status"
                    className="login-input"
                    value={form.status}
                    onChange={handleFormChange("status")}
                    aria-label="Status"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="order-date">Date</label>
                  <input
                    id="order-date"
                    type="date"
                    className="login-input"
                    value={form.date}
                    onChange={handleFormChange("date")}
                    aria-label="Date"
                    required
                  />
                </div>
                <div className="orders-modal-actions">
                  <button
                    type="button"
                    className="orders-modal-cancel-btn"
                    onClick={handleCloseModal}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="login-submit-btn orders-modal-save-btn"
                    aria-label={editingOrder ? "Update order" : "Save order"}
                  >
                    {editingOrder ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ConfirmDialog
          isOpen={!!orderToDelete}
          title="Delete Order"
          message={`Are you sure you want to delete ${orderToDelete?.id}?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default Orders;
