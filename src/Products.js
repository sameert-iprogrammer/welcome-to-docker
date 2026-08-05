import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";

const PAGE_SIZE = 10;

const emptyForm = { sku: "", name: "", category: "", price: "" };

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://dummyjson.com/products");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return products;
    return products.filter((p) => {
      const str =
        String(p.id) +
        (p.sku || "") +
        (p.title || "") +
        (p.description || "") +
        (p.category || "") +
        String(p.price) +
        (p.brand || "") +
        (p.tags ? p.tags.join(" ") : "");
      return str.toLowerCase().includes(term);
    });
  }, [searchTerm, products]);

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
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE);
  const displayTotal = totalPages || 1;

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  if (loading) {
    return (
      <div className="App App--sidebar">
        <Sidebar />
        <div className="customers-container">
          <p className="orders-no-results">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App App--sidebar">
        <Sidebar />
        <div className="customers-container">
          <p className="orders-no-results">Failed to load products: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="customers-container">
        <div className="customers-header">
          <h2 className="customers-title">Products</h2>
          <button
            type="button"
            className="customers-add-btn"
            disabled
            title="Add product feature is currently unavailable with live API data."
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
                    {product.sku || "N/A"} ({product.id})
                  </td>
                  <td className="orders-table-td">{product.title}</td>
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
        {isModalOpen && (
          <div className="product-modal-overlay" role="dialog" aria-modal="true" aria-label="Add Product">
            <div className="product-modal">
              <h3 className="product-modal-title">Add Product</h3>
              <form className="product-modal-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="product-sku">SKU</label>
                  <input id="product-sku" type="text" className="login-input" value={form.sku} onChange={handleFormChange("sku")} aria-label="SKU" required />
                </div>
                <div className="form-group">
                  <label htmlFor="product-name">Name</label>
                  <input id="product-name" type="text" className="login-input" value={form.name} onChange={handleFormChange("name")} aria-label="Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="product-category">Category</label>
                  <select id="product-category" className="login-input" value={form.category} onChange={handleFormChange("category")} aria-label="Category" required>
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
                  <input id="product-price" type="number" step="0.01" min="0" className="login-input" value={form.price} onChange={handleFormChange("price")} aria-label="Price" required />
                </div>
                <div className="product-modal-actions">
                  <button type="button" className="product-modal-cancel-btn" onClick={handleCloseModal} aria-label="Cancel add product">Cancel</button>
                  <button type="submit" className="login-submit-btn product-modal-save-btn" aria-label="Save product">Save</button>
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