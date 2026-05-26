import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";

const mockCustomers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", company: "Tech Corp", phone: "555-0101", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", company: "Data Inc", phone: "555-0102", status: "Active" },
  { id: 3, name: "Carol White", email: "carol@example.com", company: "CloudBase", phone: "555-0103", status: "Inactive" },
  { id: 4, name: "Dave Brown", email: "dave@example.com", company: "NetServices", phone: "555-0104", status: "Active" },
  { id: 5, name: "Eve Davis", email: "eve@example.com", company: "StackOps", phone: "555-0105", status: "Pending" },
  { id: 6, name: "Frank Miller", email: "frank@example.com", company: "DevPro", phone: "555-0106", status: "Active" },
  { id: 7, name: "Grace Wilson", email: "grace@example.com", company: "SysAdmin Co", phone: "555-0107", status: "Inactive" },
  { id: 8, name: "Henry Moore", email: "henry@example.com", company: "WebWare", phone: "555-0108", status: "Active" },
  { id: 9, name: "Ivy Taylor", email: "ivy@example.com", company: "AppForge", phone: "555-0109", status: "Pending" },
  { id: 10, name: "Jack Anderson", email: "jack@example.com", company: "Digital Solutions", phone: "555-0110", status: "Active" },
  { id: 11, name: "Karen Thomas", email: "karen@example.com", company: "CloudSync", phone: "555-0111", status: "Active" },
  { id: 12, name: "Leo Garcia", email: "leo@example.com", company: "DataFlow", phone: "555-0112", status: "Inactive" },
];

const PAGE_SIZE = 5;

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockCustomers;
    return mockCustomers.filter((c) => {
      const str = String(c.id) + c.name + c.email + c.company + c.phone + c.status;
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredCustomers.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedCustomers = filteredCustomers.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        <h2 className="customers-title">Customers</h2>
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
              {paginatedCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="orders-table-td">{customer.id}</td>
                  <td className="orders-table-td">{customer.name}</td>
                  <td className="orders-table-td">{customer.email}</td>
                  <td className="orders-table-td">{customer.company}</td>
                  <td className="orders-table-td">{customer.phone}</td>
                  <td className="orders-table-td">{customer.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <p className="orders-no-results">No customers found matching "{searchTerm}"</p>
        )}
        {filteredCustomers.length > 0 && (
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

export default Customers;
