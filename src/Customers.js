import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";

const API_URL = "https://dummyjson.com/users";
const PAGE_SIZE = 30;

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "User";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * PAGE_SIZE;
      const response = await fetch(`${API_URL}?skip=${skip}&limit=${PAGE_SIZE}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return users;
    return users.filter((u) => {
      const str =
        String(u.id) +
        u.firstName +
        u.lastName +
        u.email +
        (u.company?.name || "");
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm, users]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = totalUsers ? Math.ceil(totalUsers / PAGE_SIZE) : 1;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedUsers = filteredUsers.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  const handleRetry = () => {
    fetchUsers(currentPage);
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        {loading && (
          <div className="customers-loading">
            <p>Loading customers...</p>
          </div>
        )}
        {error && (
          <div className="customers-error">
            <p>{error}</p>
            <button
              className="login-submit-btn"
              type="button"
              onClick={handleRetry}
              aria-label="Retry loading customers"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="customers-header">
              <h2 className="customers-title">Customers</h2>
              <button
                type="button"
                className="customers-add-btn"
                disabled
                aria-label="Add customer"
              >
                Add Customer
              </button>
            </div>
            <input
              type="text"
              className="orders-search login-input"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search customers"
            />
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th className="orders-table-th">ID</th>
                    <th className="orders-table-th">Name</th>
                    <th className="orders-table-th">Email</th>
                    <th className="orders-table-th">Company</th>
                    <th className="orders-table-th">Phone</th>
                    <th className="orders-table-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="orders-table-td">{user.id}</td>
                      <td className="orders-table-td">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="orders-table-td">{user.email}</td>
                      <td className="orders-table-td">
                        {user.company?.name || "—"}
                      </td>
                      <td className="orders-table-td">{user.phone}</td>
                      <td className="orders-table-td">
                        {capitalize(user.role)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <p className="orders-no-results">
                No customers found matching "{searchTerm}"
              </p>
            )}
            {filteredUsers.length > 0 && (
              <div className="customers-pagination">
                <button
                  className={`customers-page-btn${currentPage === 1 ? " customers-page-btn--disabled" : ""}`}
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
                  className={`customers-page-btn${currentPage === totalPages ? " customers-page-btn--disabled" : ""}`}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Customers;