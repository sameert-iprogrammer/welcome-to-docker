import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";

const initialBookings = [
  { id: 1, customer: "Alice Johnson", service: "Consulting", date: "2026-01-15", status: "Confirmed", amount: "$250.00" },
  { id: 2, customer: "Bob Smith", service: "Training", date: "2026-01-20", status: "Pending", amount: "$150.00" },
  { id: 3, customer: "Carol White", service: "Support", date: "2026-02-01", status: "Completed", amount: "$100.00" },
  { id: 4, customer: "Dave Brown", service: "Consulting", date: "2026-02-10", status: "Confirmed", amount: "$300.00" },
  { id: 5, customer: "Eve Davis", service: "Maintenance", date: "2026-02-15", status: "Cancelled", amount: "$75.00" },
  { id: 6, customer: "Frank Miller", service: "Training", date: "2026-03-01", status: "Confirmed", amount: "$200.00" },
  { id: 7, customer: "Grace Wilson", service: "Consulting", date: "2026-03-10", status: "Pending", amount: "$350.00" },
  { id: 8, customer: "Henry Moore", service: "Support", date: "2026-03-20", status: "Completed", amount: "$120.00" },
  { id: 9, customer: "Ivy Taylor", service: "Maintenance", date: "2026-04-01", status: "Confirmed", amount: "$180.00" },
  { id: 10, customer: "Jack Anderson", service: "Training", date: "2026-04-10", status: "Pending", amount: "$225.00" },
  { id: 11, customer: "Karen Thomas", service: "Consulting", date: "2026-04-20", status: "Confirmed", amount: "$275.00" },
  { id: 12, customer: "Leo Garcia", service: "Support", date: "2026-05-01", status: "Completed", amount: "$90.00" },
];

const PAGE_SIZE = 5;

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return initialBookings;
    return initialBookings.filter((b) => {
      const str = String(b.id) + b.customer + b.service + b.date + b.status + b.amount;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedBookings = filteredBookings.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="orders-container">
        <h2 className="orders-title">Bookings</h2>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search bookings"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">ID</th>
                <th className="orders-table-th">Customer</th>
                <th className="orders-table-th">Service</th>
                <th className="orders-table-th">Date</th>
                <th className="orders-table-th">Status</th>
                <th className="orders-table-th">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="orders-table-td">{booking.id}</td>
                  <td className="orders-table-td">{booking.customer}</td>
                  <td className="orders-table-td">{booking.service}</td>
                  <td className="orders-table-td">{booking.date}</td>
                  <td className="orders-table-td">{booking.status}</td>
                  <td className="orders-table-td">{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <p className="orders-no-results">No bookings found for "{searchTerm}"</p>
        )}
        {filteredBookings.length > 0 && (
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

export default Bookings;
