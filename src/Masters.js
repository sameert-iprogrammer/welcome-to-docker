import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import { mockMasters } from "./mastersMock";
import ConfirmDialog from "./ConfirmDialog";

const PAGE_SIZE = 5;

const emptyForm = {
  code: "",
  name: "",
  description: "",
  type: "Category",
  status: "Active",
};

const Masters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [masters, setMasters] = useState(mockMasters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingMaster, setEditingMaster] = useState(null);
  const [masterToDelete, setMasterToDelete] = useState(null);

  const filteredMasters = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return masters;
    return masters.filter((m) => {
      const str =
        String(m.id) +
        m.code +
        m.name +
        m.description +
        m.type +
        m.status;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm, masters]);

  const handleOpenModal = () => {
    setForm(emptyForm);
    setEditingMaster(null);
    setIsModalOpen(true);
  };

  const handleEdit = (master) => {
    setForm({ ...master });
    setEditingMaster(master);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (master) => setMasterToDelete(master);

  const handleConfirmDelete = () => {
    setMasters((prev) => prev.filter((m) => m.id !== masterToDelete.id));
    setMasterToDelete(null);
    toast.success("Master deleted successfully");
  };

  const handleCancelDelete = () => setMasterToDelete(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    if (editingMaster) {
      setMasters((prev) =>
        prev.map((m) =>
          m.id === editingMaster.id ? { ...m, ...form } : m
        )
      );
      setIsModalOpen(false);
      toast.success("Master updated successfully");
    } else {
      const nextId = masters.length
        ? Math.max(...masters.map((m) => m.id)) + 1
        : 1;
      const newMaster = { id: nextId, ...form };
      setMasters((prev) => [...prev, newMaster]);
      setIsModalOpen(false);
      toast.success("Master added successfully");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredMasters.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedMasters = filteredMasters.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        <div className="customers-header">
          <h2 className="customers-title">Masters</h2>
          <button
            type="button"
            className="customers-add-btn"
            onClick={handleOpenModal}
            aria-label="Add master"
          >
            Add Master
          </button>
        </div>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search masters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search masters"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">ID</th>
                <th className="orders-table-th">Code</th>
                <th className="orders-table-th">Name</th>
                <th className="orders-table-th">Description</th>
                <th className="orders-table-th">Type</th>
                <th className="orders-table-th">Status</th>
                <th className="orders-table-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMasters.map((master) => (
                <tr key={master.id}>
                  <td className="orders-table-td">{master.id}</td>
                  <td className="orders-table-td">{master.code}</td>
                  <td className="orders-table-td">{master.name}</td>
                  <td className="orders-table-td">{master.description}</td>
                  <td className="orders-table-td">{master.type}</td>
                  <td className="orders-table-td">{master.status}</td>
                  <td className="orders-table-td">
                    <button
                      onClick={() => handleEdit(master)}
                      className="masters-edit-btn"
                      aria-label={`Edit ${master.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(master)}
                      className="masters-delete-btn"
                      aria-label={`Delete ${master.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMasters.length === 0 && (
          <p className="orders-no-results">
            No masters found matching "{searchTerm}"
          </p>
        )}
        {filteredMasters.length > 0 && (
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
                currentPage === totalPages
                  ? " customers-page-btn--disabled"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
        {isModalOpen && (
          <div
            className="masters-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={editingMaster ? "Edit Master" : "Add Master"}
          >
            <div className="masters-modal">
              <h3 className="masters-modal-title">
                {editingMaster ? "Edit Master" : "Add Master"}
              </h3>
              <form className="masters-modal-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="master-code">Code</label>
                  <input
                    id="master-code"
                    type="text"
                    className="login-input"
                    value={form.code}
                    onChange={handleFormChange("code")}
                    aria-label="Code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="master-name">Name</label>
                  <input
                    id="master-name"
                    type="text"
                    className="login-input"
                    value={form.name}
                    onChange={handleFormChange("name")}
                    aria-label="Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="master-description">Description</label>
                  <input
                    id="master-description"
                    type="text"
                    className="login-input"
                    value={form.description}
                    onChange={handleFormChange("description")}
                    aria-label="Description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="master-type">Type</label>
                  <select
                    id="master-type"
                    className="login-input"
                    value={form.type}
                    onChange={handleFormChange("type")}
                    aria-label="Type"
                    required
                  >
                    <option value="Category">Category</option>
                    <option value="SubCategory">SubCategory</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="master-status">Status</label>
                  <select
                    id="master-status"
                    className="login-input"
                    value={form.status}
                    onChange={handleFormChange("status")}
                    aria-label="Status"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="masters-modal-actions">
                  <button
                    type="button"
                    className="masters-modal-cancel-btn"
                    onClick={handleCloseModal}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="login-submit-btn masters-modal-save-btn"
                    aria-label={
                      editingMaster ? "Update master" : "Save master"
                    }
                  >
                    {editingMaster ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ConfirmDialog
          isOpen={!!masterToDelete}
          title="Delete Master"
          message={`Are you sure you want to delete ${masterToDelete?.name}?`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      </div>
    </div>
  );
};

export default Masters;
