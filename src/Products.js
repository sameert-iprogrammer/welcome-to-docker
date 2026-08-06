import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

const PAGE_SIZE = 10;

const emptyForm = { sku: "", title: "", category: "", price: "" };

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://dummyjson.com/products?sortBy=title&order=asc&limit=100"
        );
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (!cancelled) {
          const mappedProducts = data.products.map((p) => ({
            ...p,
            name: p.title,
          }));
          setProducts(mappedProducts);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let result = products.filter((p) => {
      const str =
        String(p.id) +
        (p.sku || "") +
        p.name +
        (p.title || "") +
        (p.category || "") +
        String(p.price);
      return str.toLowerCase().includes(term);
    });

    result.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });

    return result;
  }, [products, searchTerm, sortOrder]);

  const handleOpenModal = () => {
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    const nextId = products.length
      ? Math.max(...products.map((p) => p.id)) + 1
      : 1;
    const newProduct = { id: nextId, ...form, price: Number(form.price) };
    setProducts((prev) => [...prev, newProduct]);
    setIsModalOpen(false);
    toast.success("Product added successfully");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(sortedProducts.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = sortedProducts.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        <div className="customers-header">
          <h2 className="customers-title">Products</h2>
          <div className="products-sort-container">
            <select
              id="product-sort"
              className="products-sort login-input"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort by title"
            >
              <option value="asc">Sort by: Name (A→Z)</option>
              <option value="desc">Sort by: Name (Z→A)</option>
            </select>
          </div>
          <button
            type="button"
            className="customers-add-btn"
            onClick={handleOpenModal}
            aria-label="Add product"
          >
            Add Product
          </button>
        </div>
        <input
          type="text"
          className="orders-search login-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search products"
        />
        {loading && <p>Loading products...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && (
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
                  <tr key={product.id}>
                    <td className="orders-table-td">
                      {product.sku
                        ? `${product.sku} (${product.id})`
                        : product.id}
                    </td>
                    <td className="orders-table-td">{product.name}</td>
                    <td className="orders-table-td">{product.category}</td>
                    <td className="orders-table-td">
                      {formatPrice(product.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {sortedProducts.length === 0 && !loading && !error && (
          <p className="orders-no-results">
            No products found matching "{searchTerm}"
          </p>
        )}
        {sortedProducts.length > 0 && (
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
                currentPage === totalPages
                  ? " customers-page-btn--disabled"
                  : ""
              }`}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
        {isModalOpen && (
          <div
            className="product-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label="Add Product"
          >
            <div className="product-modal">
              <h3 className="product-modal-title">Add Product</h3>
              <form
                className="product-modal-form"
                onSubmit={handleSave}
              >
                <div className="form-group">
                  <label htmlFor="product-sku">SKU</label>
                  <input
                    id="product-sku"
                    type="text"
                    className="login-input"
                    value={form.sku}
                    onChange={handleFormChange("sku")}
                    aria-label="SKU"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="product-title">Name</label>
                  <input
                    id="product-title"
                    type="text"
                    className="login-input"
                    value={form.title}
                    onChange={handleFormChange("title")}
                    aria-label="Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="product-category">Category</label>
                  <select
                    id="product-category"
                    className="login-input"
                    value={form.category}
                    onChange={handleFormChange("category")}
                    aria-label="Category"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Office">Office</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Storage">Storage</option>
                    <option value="Wearables">Wearables</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="product-price">Price</label>
                  <input
                    id="product-price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="login-input"
                    value={form.price}
                    onChange={handleFormChange("price")}
                    aria-label="Price"
                    required
                  />
                </div>
                <div className="product-modal-actions">
                  <button
                    type="button"
                    className="product-modal-cancel-btn"
                    onClick={handleCloseModal}
                    aria-label="Cancel add product"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="login-submit-btn product-modal-save-btn"
                    aria-label="Save product"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;