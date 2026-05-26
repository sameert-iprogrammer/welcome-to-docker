import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import { mockProducts } from "./productsMock";

const PAGE_SIZE = 10;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return mockProducts;
    return mockProducts.filter((p) => {
      const str =
        String(p.id) +
        p.sku +
        p.name +
        (p.category || "") +
        String(p.price);
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        <h2 className="customers-title">Products</h2>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th className="orders-table-th">SKU/ID</th>
                <th className="orders-table-th">Name</th>
                <th className="orders-table-th">Category</th>
                <th className="orders-table-th">Price</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.sku}>
                  <td className="orders-table-td">
                    {product.sku} ({product.id})
                  </td>
                  <td className="orders-table-td">{product.name}</td>
                  <td className="orders-table-td">{product.category}</td>
                  <td className="orders-table-td">{formatPrice(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <p className="orders-no-results">
            No products found matching "{searchTerm}"
          </p>
        )}
        {filteredProducts.length > 0 && (
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
                currentPage === totalPages ? " customers-page-btn--disabled" : ""
              }`}
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

export default Products;
