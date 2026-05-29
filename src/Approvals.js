import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const mockApprovals = [
  { id: "APR-001", requester: "Alice Johnson", type: "Expense Report", amount: "$250.00", date: "2026-05-20", status: "Pending" },
  { id: "APR-002", requester: "Bob Smith", type: "Travel Request", amount: "$1,200.00", date: "2026-05-18", status: "Approved" },
  { id: "APR-003", requester: "Carol White", type: "Purchase Order", amount: "$3,500.00", date: "2026-05-15", status: "Pending" },
  { id: "APR-004", requester: "Dave Brown", type: "Time Off", amount: "$0.00", date: "2026-05-22", status: "Rejected" },
  { id: "APR-005", requester: "Eve Davis", type: "Expense Report", amount: "$175.50", date: "2026-05-19", status: "Pending" },
  { id: "APR-006", requester: "Frank Miller", type: "Travel Request", amount: "$890.00", date: "2026-05-21", status: "Pending" },
  { id: "APR-007", requester: "Grace Wilson", type: "Purchase Order", amount: "$5,200.00", date: "2026-05-14", status: "Approved" },
  { id: "APR-008", requester: "Henry Moore", type: "Time Off", amount: "$0.00", date: "2026-05-23", status: "Pending" },
  { id: "APR-009", requester: "Ivy Taylor", type: "Expense Report", amount: "$430.00", date: "2026-05-17", status: "Rejected" },
  { id: "APR-010", requester: "Jack Anderson", type: "Travel Request", amount: "$1,050.00", date: "2026-05-16", status: "Pending" },
];

const PAGE_SIZE = 5;

const Approvals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvals, setApprovals] = useState(mockApprovals);

  const filteredApprovals = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return approvals;
    return approvals.filter((a) => {
      const str = a.id + a.requester + a.type + a.amount + a.date + a.status;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm, approvals]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredApprovals.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedApprovals = filteredApprovals.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  const handleApprove = (id) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Approved" } : a))
    );
    toast.success(`Approved ${id}`);
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="approvals-container">
        <h2 className="approvals-title">Approvals</h2>
        <input
          type="text"
          className="approvals-search login-input"
          placeholder="Search approvals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search approvals"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">ID</th>
                <th className="orders-table-th">Requester</th>
                <th className="orders-table-th">Type</th>
                <th className="orders-table-th">Amount</th>
                <th className="orders-table-th">Date</th>
                <th className="orders-table-th">Status</th>
                <th className="orders-table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApprovals.map((approval) => (
                <tr key={approval.id}>
                  <td className="orders-table-td">{approval.id}</td>
                  <td className="orders-table-td">{approval.requester}</td>
                  <td className="orders-table-td">{approval.type}</td>
                  <td className="orders-table-td">{approval.amount}</td>
                  <td className="orders-table-td">{approval.date}</td>
                  <td className="orders-table-td">{approval.status}</td>
                  <td className="orders-table-td">
                    <button
                      className="approvals-approve-btn"
                      onClick={() => handleApprove(approval.id)}
                      disabled={approval.status === "Approved"}
                      aria-label={`Approve ${approval.id}`}
                    >
                      {approval.status === "Approved" ? "Approved" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredApprovals.length === 0 && (
          <p className="orders-no-results">
            No approvals found matching "{searchTerm}"
          </p>
        )}
        {filteredApprovals.length > 0 && (
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

export default Approvals;
