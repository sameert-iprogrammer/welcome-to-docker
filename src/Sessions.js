import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { mockSessions } from "./sessionsMock";

const PAGE_SIZE = 5;

const Sessions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSessions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockSessions;
    return mockSessions.filter((s) => {
      const str =
        String(s.id) +
        s.user +
        s.loginTime +
        (s.logoutTime || "") +
        s.device;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = filteredSessions.length > 0 ? Math.ceil(filteredSessions.length / PAGE_SIZE) : 0;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredSessions.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 0;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="sessions-container">
        <h2 className="sessions-header">Sessions</h2>
        <input
          type="text"
          className="sessions-search login-input"
          placeholder="Search sessions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search sessions"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">Session ID</th>
                <th className="orders-table-th">User</th>
                <th className="orders-table-th">Login Time</th>
                <th className="orders-table-th">Logout Time</th>
                <th className="orders-table-th">Device</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((session) => (
                <tr key={session.id}>
                  <td className="orders-table-td">{session.id}</td>
                  <td className="orders-table-td">{session.user}</td>
                  <td className="orders-table-td">{session.loginTime}</td>
                  <td className="orders-table-td">
                    {session.logoutTime || "Active"}
                  </td>
                  <td className="orders-table-td">{session.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSessions.length === 0 && (
          <p className="orders-no-results">
            No sessions found matching "{searchTerm}"
          </p>
        )}
        {filteredSessions.length > 0 && (
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

export default Sessions;