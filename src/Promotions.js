import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { mockPromotions } from "./promotionsMock";

const PAGE_SIZE = 5;

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPromotions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockPromotions;
    return mockPromotions.filter((p) => {
      const str =
        String(p.id) +
        p.code +
        p.name +
        p.discount +
        p.startDate +
        p.endDate +
        p.status;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

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
        <h2 className="promotions-title">Promotions</h2>
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
                <th className="orders-table-th">Code</th>
                <th className="orders-table-th">Name</th>
                <th className="orders-table-th">Discount</th>
                <th className="orders-table-th">Start Date</th>
                <th className="orders-table-th">End Date</th>
                <th className="orders-table-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPromotions.map((promotion) => (
                <tr key={promotion.id}>
                  <td className="orders-table-td">{promotion.id}</td>
                  <td className="orders-table-td">{promotion.code}</td>
                  <td className="orders-table-td">{promotion.name}</td>
                  <td className="orders-table-td">{promotion.discount}</td>
                  <td className="orders-table-td">{promotion.startDate}</td>
                  <td className="orders-table-td">{promotion.endDate}</td>
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

export default Promotions;