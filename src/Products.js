import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [pageSize] = useState(PAGE_SIZE);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setSkip(0);
  }, [debouncedSearch]);

  const fetchProducts = useCallback(async (signal) => {
    const params = new URLSearchParams({
      limit: String(pageSize),
      skip: String(skip),
    });
    const baseUrl = debouncedSearch.trim()
      ? `https://dummyjson.com/products/search?q=${encodeURIComponent(debouncedSearch.trim())}&${params}`
      : `https://dummyjson.com/products?${params}`;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(baseUrl, { signal });
      if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total ?? 0);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Failed to load products");
      setProducts([]);
      setTotal(0);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [debouncedSearch, skip, pageSize, fetchKey]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProducts(controller.signal);
    return () => controller.abort();
  }, [fetchProducts]);

  const currentPage = Math.floor(skip / pageSize) + 1;
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1;
  const rangeStart = total === 0 ? 0 : skip + 1;
  const rangeEnd = Math.min(skip + pageSize, total);

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  const handleRetry = () => setFetchKey((k) => k + 1);

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="products-container">
        <div className="products-header">
          <h2 className="products-title">Products</h2>
        </div>
        <input
          type="text"
          className="products-search login-input"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search products"
        />
        {loading && <p className="products-loading">Loading products...</p>}
        {error && !loading && (
          <div className="products-error">
            <p>{error}</p>
            <button type="button" className="products-page-btn" onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <p className="products-empty">No products found</p>
        )}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th className="products-table-th">Thumbnail</th>
                    <th className="products-table-th">Title</th>
                    <th className="products-table-th">Category</th>
                    <th className="products-table-th">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <ProductRow key={product.id} product={product} formatPrice={formatPrice} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="products-pagination">
              <button
                className={`products-page-btn${
                  currentPage === 1 ? " products-page-btn--disabled" : ""
                }`}
                onClick={() => setSkip((s) => Math.max(0, s - pageSize))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="products-page-info">
                Page {currentPage} of {totalPages} — Showing {rangeStart}–{rangeEnd} of {total}
              </span>
              <button
                className={`products-page-btn${
                  currentPage >= totalPages ? " products-page-btn--disabled" : ""
                }`}
                onClick={() => setSkip((s) => s + pageSize)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ProductRow = ({ product, formatPrice }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <tr>
      <td className="products-table-td">
        {product.thumbnail && !imgFailed ? (
          <img
            src={product.thumbnail}
            alt=""
            className="products-thumbnail"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="products-thumbnail products-thumbnail--fallback" aria-hidden="true" />
        )}
      </td>
      <td className="products-table-td">{product.title}</td>
      <td className="products-table-td">{product.category}</td>
      <td className="products-table-td">{formatPrice(product.price)}</td>
    </tr>
  );
};

export default Products;
