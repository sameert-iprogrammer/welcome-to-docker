import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { mockPromotions } from "./promotionsMock";

const PAGE_SIZE = 5;

const emptyForm = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  discountType: "",
  discountValue: "",
  status: "Draft",
};

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [promotions, setPromotions] = useState(mockPromotions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredPromotions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return promotions;
    return promotions.filter((p) => {
      const str =
        String(p.id) +
        p.name +
        p.description +
        p.startDate +
        p.endDate +
        p.discountType +
        String(p.discountValue) +
        p.status;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm, promotions]);

  const handleOpenModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    const nextId = promotions.length
      ? Math.max(...promotions.map((p) => p.id)) + 1
      : 1;
    const newPromotion = {
      id: nextId,
      ...form,
      discountValue: Number(form.discountValue),
    };
    setPromotions((prev) => [...prev, newPromotion]);
    setIsModalOpen(false);
    toast.success("Promotion added successfully");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPromotions.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedPromotions = filteredPromotions.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        <div className="customers-header">
          <h2 className="customers-title">Promotions</h2>
          <button
            type="button"
            className="customers-add-btn"
            onClick={handleOpenModal}
            aria-label="Add promotion"
          >
            Add Promotion
          </button>
        </div>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search promotions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search promotions"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">ID</th>
                <th className="orders-table-th">Name</th>
                <th className="orders-table-th">Description</th>
                <th className="orders-table-th">Start Date</th>
                <th className="orders-table-th">End Date</th>
                <th className="orders-table-th">Discount Type</th>
                <th className="orders-table-th">Discount Value</th>
                <th className="orders-table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPromotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td className="orders-table-td">{promotion.id}</td>
                  <td className="orders-table-td">{promotion.name}</td>
                  <td className="orders-table-td">{promotion.description}</td>
                  <td className="orders-table-td">{promotion.startDate}</td>
                  <td className="orders-table-td">{promotion.endDate}</td>
                  <td className="orders-table-td">{promotion.discountType}</td>
                  <td className="orders-table-td">{promotion.discountValue}</td>
                  <td className="orders-table-td">{promotion.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPromotions.length === 0 && (
          <p className="orders-no-results">
            No promotions found matching "{searchTerm}"
          </p>
        )}
        {filteredPromotions.length > 0 && (
          <div className="customers-pagination">
            <button
              className={`customers-page-btn${
                currentPage === 1 ? " customers-page-btn--disabled" : ""
              }`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="customers-page-info">
              Page {currentPage} of {displayTotal}
            </span>
            <button
              className={`customers-page-btn${
                currentPage === totalPages ? " customers-page-btn--disabled" : ""
              }`}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
        {isModalOpen && (
          <div
            className="product-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Add Promotion"
          >
            <div className="product-modal">
              <h3 className="product-modal-title">Add Promotion</h3>
              <form
                className="product-modal-form"
                onSubmit={handleSave}
              >
                <div className="form-group">
                  <label htmlFor="promotion-name">Name</label>
                  <input
                    id="promotion-name"
                    type="text"
                    className="login-input"
                    value={form.name}
                    onChange={handleFormChange("name")}
                    aria-label="Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="promotion-description">Description</label>
                  <input
                    id="promotion-description"
                    type="text"
                    className="login-input"
                    value={form.description}
                    onChange={handleFormChange("description")}
                    aria-label="Description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="promotion-start-date">Start Date</label>
                  <input
                    id="promotion-start-date"
                    type="date"
                    className="login-input"
                    value={form.startDate}
                    onChange={handleFormChange("startDate")}
                    aria-label="Start Date"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="promotion-end-date">End Date</label>
                  <input
                    id="promotion-end-date"
                    type="date"
                    className="login-input"
                    value={form.endDate}
                    onChange={handleFormChange("endDate")}
                    aria-label="End Date"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="promotion-discount-type">Discount Type</label>
                  <select
                    id="promotion-discount-type"
                    className="login-input"
                    value={form.discountType}
                    onChange={handleFormChange("discountType")}
                    aria-label="Discount Type"
                    required
                  >
                    <option value="">Select discount type</option>
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="promotion-discount-value">Discount Value</label>
                  <input
                    id="promotion-discount-value"
                    type="number"
                    step="0.01"
                    min="0"
                    className="login-input"
                    value={form.discountValue}
                    onChange={handleFormChange("discountValue")}
                    aria-label="Discount Value"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="promotion-status">Status</label>
                  <select
                    id="promotion-status"
                    className="login-input"
                    value={form.status}
                    onChange={handleFormChange("status")}
                    aria-label="Status"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div className="product-modal-actions">
                  <button
                    type="button"
                    className="product-modal-cancel-btn"
                    onClick={handleCloseModal}
                    aria-label="Cancel add promotion"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="login-submit-btn product-modal-save-btn"
                    aria-label="Save promotion"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Promotions;