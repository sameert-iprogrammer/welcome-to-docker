import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";

const mockLogs = [
  { id: "LOG-001", timestamp: "2026-05-28 14:32:10", level: "ERROR", source: "auth-service", message: "Failed login attempt for user admin", user: "admin", ip: "192.168.1.100", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  { id: "LOG-002", timestamp: "2026-05-28 14:30:45", level: "INFO", source: "api-gateway", message: "Request processed successfully for /api/users", user: "jdoe", ip: "10.0.0.45", userAgent: "curl/7.68.0" },
  { id: "LOG-003", timestamp: "2026-05-28 12:15:22", level: "WARN", source: "db-connector", message: "Connection pool nearing capacity (85%)", user: null, ip: null, userAgent: null },
  { id: "LOG-004", timestamp: "2026-05-27 09:05:33", level: "INFO", source: "scheduler", message: "Daily cleanup job completed", user: "system", ip: "127.0.0.1", userAgent: "internal" },
  { id: "LOG-005", timestamp: "2026-05-27 08:44:18", level: "ERROR", source: "payment-service", message: "Transaction declined: insufficient funds", user: "cwhite", ip: "192.168.2.50", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
  { id: "LOG-006", timestamp: "2026-05-26 22:10:05", level: "DEBUG", source: "cache-service", message: "Cache invalidation triggered for key: user_profile:1024", user: null, ip: null, userAgent: null },
  { id: "LOG-007", timestamp: "2026-05-26 16:30:00", level: "INFO", source: "auth-service", message: "User registration successful", user: "newuser1", ip: "172.16.0.88", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)" },
  { id: "LOG-008", timestamp: "2026-05-26 11:22:14", level: "WARN", source: "rate-limiter", message: "Rate limit exceeded for endpoint /api/orders", user: "bob_smith", ip: "203.0.113.55", userAgent: "PostmanRuntime/7.36.0" },
  { id: "LOG-009", timestamp: "2026-05-25 19:45:30", level: "INFO", source: "deployment", message: "Version 3.2.1 deployed to production", user: "devops", ip: "10.10.10.1", userAgent: "Jenkins/2.401" },
  { id: "LOG-010", timestamp: "2026-05-25 14:00:00", level: "DEBUG", source: "monitoring", message: "Health check passed for all 12 services", user: null, ip: null, userAgent: null },
  { id: "LOG-011", timestamp: "2026-05-24 08:15:42", level: "ERROR", source: "file-upload", message: "File size exceeds maximum allowed (25MB)", user: "alice_j", ip: "198.51.100.23", userAgent: "Mozilla/5.0 (Linux; Android 14)" },
  { id: "LOG-012", timestamp: "2026-05-24 06:00:10", level: "INFO", source: "backup", message: "Daily database backup completed successfully", user: "system", ip: "127.0.0.1", userAgent: "internal" },
  { id: "LOG-013", timestamp: "2026-05-23 17:30:55", level: "DEBUG", source: "search-index", message: "Reindexing completed for 15,342 documents", user: null, ip: null, userAgent: null },
  { id: "LOG-014", timestamp: "2026-05-23 10:10:10", level: "WARN", source: "auth-service", message: "JWT token expiry threshold reached for 3 sessions", user: "support", ip: "192.168.10.200", userAgent: "Mozilla/5.0 (X11; Linux x86_64)" },
];

const PAGE_SIZE = 5;

const levelColors = {
  INFO: "#27ae60",
  WARN: "#f39c12",
  ERROR: "#e74c3c",
  DEBUG: "#95a5a6",
};

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockLogs;
    return mockLogs.filter((log) => {
      const str = String(log.id) + log.timestamp + log.level + log.source + log.message + (log.user || "");
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedLogs = filteredLogs.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  const handleView = (log) => {
    setSelectedLog(log);
  };

  const handleCloseModal = () => {
    setSelectedLog(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedLog(null);
    }
  };

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="logs-container">
        <h2 className="logs-title">Logs</h2>
        <input
          type="text"
          className="logs-search login-input"
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search logs"
        />
        <div className="logs-table-wrapper">
          <table className="logs-table">
            <thead>
              <tr>
                <th className="logs-table-th">ID</th>
                <th className="logs-table-th">Timestamp</th>
                <th className="logs-table-th">Level</th>
                <th className="logs-table-th">Source</th>
                <th className="logs-table-th">Message</th>
                <th className="logs-table-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id}>
                  <td className="logs-table-td">{log.id}</td>
                  <td className="logs-table-td">{log.timestamp}</td>
                  <td className="logs-table-td">
                    <span style={{ color: levelColors[log.level] || "#e6f1ff" }}>{log.level}</span>
                  </td>
                  <td className="logs-table-td">{log.source}</td>
                  <td className="logs-table-td">{log.message}</td>
                  <td className="logs-table-td">
                    <button
                      className="logs-view-btn"
                      onClick={() => handleView(log)}
                      aria-label={`View details for ${log.id}`}
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length === 0 && (
          <p className="logs-no-results">No logs found matching "{searchTerm}"</p>
        )}
        {filteredLogs.length > 0 && (
          <div className="logs-pagination">
            <button
              className={`logs-page-btn${currentPage === 1 ? " logs-page-btn--disabled" : ""}`}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="logs-page-info">
              Page {currentPage} of {displayTotal}
            </span>
            <button
              className={`logs-page-btn${currentPage === totalPages ? " logs-page-btn--disabled" : ""}`}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
        {selectedLog && (
          <div
            className="logs-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Log details for ${selectedLog.id}`}
            onClick={handleOverlayClick}
          >
            <div className="logs-modal">
              <h3 className="logs-modal-title">Log Details — {selectedLog.id}</h3>
              <div className="logs-modal-body">
                <div className="logs-modal-field">
                  <span className="logs-modal-label">ID</span>
                  <span className="logs-modal-value">{selectedLog.id}</span>
                </div>
                <div className="logs-modal-field">
                  <span className="logs-modal-label">Timestamp</span>
                  <span className="logs-modal-value">{selectedLog.timestamp}</span>
                </div>
                <div className="logs-modal-field">
                  <span className="logs-modal-label">Level</span>
                  <span className="logs-modal-value" style={{ color: levelColors[selectedLog.level] || "#e6f1ff" }}>
                    {selectedLog.level}
                  </span>
                </div>
                <div className="logs-modal-field">
                  <span className="logs-modal-label">Source</span>
                  <span className="logs-modal-value">{selectedLog.source}</span>
                </div>
                <div className="logs-modal-field">
                  <span className="logs-modal-label">Message</span>
                  <span className="logs-modal-value">{selectedLog.message}</span>
                </div>
                {selectedLog.user && (
                  <div className="logs-modal-field">
                    <span className="logs-modal-label">User</span>
                    <span className="logs-modal-value">{selectedLog.user}</span>
                  </div>
                )}
                {selectedLog.ip && (
                  <div className="logs-modal-field">
                    <span className="logs-modal-label">IP</span>
                    <span className="logs-modal-value">{selectedLog.ip}</span>
                  </div>
                )}
                {selectedLog.userAgent && (
                  <div className="logs-modal-field">
                    <span className="logs-modal-label">User Agent</span>
                    <span className="logs-modal-value">{selectedLog.userAgent}</span>
                  </div>
                )}
              </div>
              <div className="logs-modal-actions">
                <button
                  className="logs-modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Close log details"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
