import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { mockSessions } from "./sessionsMock";

const PAGE_SIZE = 30;

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSessions = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockSessions;
    return mockSessions.filter((s) => {
      const str =
        String(s.id) +
        s.title +
        s.date +
        s.duration +
        s.status +
        String(s.attendees);
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredSessions.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedSessions = filteredSessions.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="sessions-container">
        <h2 className="sessions-title">Sessions</h2>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search sessions…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search sessions"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">ID</th>
                <th className="orders-table-th">Title</th>
                <th className="orders-table-th">Date</th>
                <th className="orders-table-th">Duration</th>
                <th className="orders-table-th">Status</th>
                <th className="orders-table-th">Attendees</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSessions.map((session) => (
                <tr key={session.id}>
                  <td className="orders-table-td">{session.id}</td>
                  <td className="orders-table-td">{session.title}</td>
                  <td className="orders-table-td">{session.date}</td>
                  <td className="orders-table-td">{session.duration}</td>
                  <td className="orders-table-td">{session.status}</td>
                  <td className="orders-table-td">{session.attendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSessions.length === 0 && (
          <p className="orders-no-results">No sessions found.</p>
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