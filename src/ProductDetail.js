import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = () => {
    setLoading(true);
    setError(null);
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Product not found (HTTP ${res.status})`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const formatPrice = (p) => `$${Number(p).toFixed(2)}`;

  const handleBack = () => {
    navigate("/products");
  };

  const handleRetry = () => {
    fetchProduct();
  };

  if (loading) {
    return (
      <div className="App App--sidebar">
        <Sidebar />
        <div className="product-detail-container">
          <p className="product-detail-loading">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App App--sidebar">
        <Sidebar />
        <div className="product-detail-container">
          <div className="product-detail-error">
            <h2 className="product-detail-error-title">Error</h2>
            <p className="product-detail-error-message">{error}</p>
            <button
              type="button"
              className="product-detail-retry-btn"
              onClick={handleRetry}
            >
              Retry
            </button>
            <button
              type="button"
              className="product-detail-back-btn"
              onClick={handleBack}
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="App App--sidebar">
        <Sidebar />
        <div className="product-detail-container">
          <p className="product-detail-loading">Product not found.</p>
        </div>
      </div>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : product.rating || "N/A";

  return (
    <div className="App App--sidebar">
      <Sidebar />
      <div className="product-detail-container">
        <button
          type="button"
          className="product-detail-back-btn"
          onClick={handleBack}
        >
          Back to Products
        </button>

        <div className="product-detail-header">
          <h2 className="product-detail-title">{product.title}</h2>
          <div className="product-detail-meta">
            <span className="product-detail-brand">{product.brand}</span>
            <span className="product-detail-category">
              {product.category}
            </span>
            <span
              className={`product-detail-status${
                product.availabilityStatus === "In Stock"
                  ? " product-detail-status--in-stock"
                  : " product-detail-status--out-of-stock"
              }`}
            >
              {product.availabilityStatus}
            </span>
          </div>
          <div className="product-detail-rating">
            <span className="product-detail-rating-value">
              {averageRating}
            </span>
            <span className="product-detail-rating-label">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>
        </div>

        <div className="product-detail-body">
          <div className="product-detail-images">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="product-detail-thumbnail"
            />
            {product.images && product.images.length > 0 && (
              <div className="product-detail-image-strip">
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.title} - image ${idx + 1}`}
                    className="product-detail-image-item"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-detail-section">
            <h3 className="product-detail-section-title">Pricing</h3>
            <div className="product-detail-pricing">
              <span className="product-price-original">
                {formatPrice(product.price)}
              </span>
              <span className="product-price-discounted">
                {formatPrice(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="product-price-discount">
                  {product.discountPercentage}% off
                </span>
              )}
            </div>
          </div>

          <div className="product-detail-section">
            <h3 className="product-detail-section-title">Basic Information</h3>
            <div className="product-info-grid">
              <div className="product-info-item">
                <span className="product-info-label">SKU</span>
                <span className="product-info-value">{product.sku}</span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Brand</span>
                <span className="product-info-value">{product.brand}</span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Category</span>
                <span className="product-info-value">{product.category}</span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Rating</span>
                <span className="product-info-value">{averageRating}</span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Stock</span>
                <span className="product-info-value">{product.stock}</span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Minimum Order</span>
                <span className="product-info-value">
                  {product.minimumOrderQuantity}
                </span>
              </div>
            </div>
          </div>

          <div className="product-detail-section">
            <h3 className="product-detail-section-title">Description</h3>
            <p className="product-detail-description">{product.description}</p>
          </div>

          <div className="product-detail-section">
            <h3 className="product-detail-section-title">Dimensions & Weight</h3>
            <div className="product-info-grid">
              <div className="product-info-item">
                <span className="product-info-label">Width</span>
                <span className="product-info-value">
                  {product.dimensions?.width}
                </span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Height</span>
                <span className="product-info-value">
                  {product.dimensions?.height}
                </span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Depth</span>
                <span className="product-info-value">
                  {product.dimensions?.depth}
                </span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Weight</span>
                <span className="product-info-value">{product.weight}</span>
              </div>
            </div>
          </div>

          <div className="product-detail-section">
            <h3 className="product-detail-section-title">Shipping & Returns</h3>
            <div className="product-info-grid">
              <div className="product-info-item">
                <span className="product-info-label">Warranty</span>
                <span className="product-info-value">
                  {product.warrantyInformation}
                </span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Shipping</span>
                <span className="product-info-value">
                  {product.shippingInformation}
                </span>
              </div>
              <div className="product-info-item">
                <span className="product-info-label">Return Policy</span>
                <span className="product-info-value">
                  {product.returnPolicy}
                </span>
              </div>
            </div>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="product-detail-section">
              <h3 className="product-detail-section-title">Reviews</h3>
              <div className="product-detail-average-rating">
                Average Rating: <span className="product-detail-average-value">{averageRating}</span> / 5
              </div>
              <ul className="product-reviews-list">
                {product.reviews.map((review, idx) => (
                  <li key={idx} className="product-review-item">
                    <div className="product-review-header">
                      <span className="product-review-name">
                        {review.reviewerName}
                      </span>
                      <span className="product-review-rating">
                        {review.rating} / 5
                      </span>
                    </div>
                    <div className="product-review-date">
                      {review.date}
                    </div>
                    <p className="product-review-comment">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;