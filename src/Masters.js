import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { mockMasters } from "./mastersMock";

const PAGE_SIZE = 5;

const Masters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMasters = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockMasters;
    return mockMasters.filter((m) => {
      const str =
        String(m.id) +
        m.code +
        m.name +
        m.description +
        m.type +
        m.status;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

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
        <h2 className="customers-title">Masters</h2>
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
      </div>
    </div>
  );
};

export default Masters;
