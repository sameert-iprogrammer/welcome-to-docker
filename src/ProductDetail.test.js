import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductDetail from "./ProductDetail";

const mockProduct = {
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "Smartphones",
  sku: "POSTADESK-991",
  weight: 4,
  dimensions: { width: 21.2, height: 20.5, depth: 8.3 },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships in 1 month",
  availabilityStatus: "In Stock",
  returnPolicy: "30 days return policy",
  minimumOrderQuantity: 1,
  reviews: [
    {
      rating: 5,
      comment: "Very happy with my purchase!",
      date: "2026-06-01T10:00:00.000Z",
      reviewerName: "John Doe",
      reviewerEmail: "john@example.com",
    },
    {
      rating: 4,
      comment: "Great product, fast delivery.",
      date: "2026-05-15T10:00:00.000Z",
      reviewerName: "Jane Smith",
      reviewerEmail: "jane@example.com",
    },
  ],
  thumbnail: "https://dummyjson.com/icon/ios/128",
  images: [
    "https://dummyjson.com/images/additional-1.jpg",
    "https://dummyjson.com/images/additional-2.jpg",
  ],
};

describe("ProductDetail", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders without crashing", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    jest.runAllTimers();
  });

  it("displays loading state", () => {
    global.fetch = jest.fn(() => new Promise(() => {}));

    const { getByText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    expect(getByText(/loading product details/i)).toBeInTheDocument();
  });

  it("fetches and displays product data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByText, getByRole } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("iPhone 9")).toBeInTheDocument();
    });

    expect(getByText("An apple mobile which is nothing like apple")).toBeInTheDocument();
    expect(getByText("Apple")).toBeInTheDocument();
    expect(getByText("Smartphones")).toBeInTheDocument();
    expect(getByText("In Stock")).toBeInTheDocument();
    expect(getByText("POSTADESK-991")).toBeInTheDocument();
    expect(getByText("1 year warranty")).toBeInTheDocument();
    expect(getByText("Ships in 1 month")).toBeInTheDocument();
    expect(getByText("30 days return policy")).toBeInTheDocument();
  });

  it("displays discounted pricing correctly", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("$549.00")).toBeInTheDocument();
    });

    // 549 * (1 - 12.96 / 100) = 549 * 0.8704 = 477.85
    expect(getByText("$477.85")).toBeInTheDocument();
    expect(getByText("12.96% off")).toBeInTheDocument();
  });

  it("displays the product thumbnail image", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByAltText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByAltText("iPhone 9")).toBeInTheDocument();
    });
  });

  it("displays additional images when present", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getAllByAltText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      const additionalImages = getAllByAltText(/iPhone 9 - image \d+/);
      expect(additionalImages.length).toBe(2);
    });
  });

  it("displays reviews with calculated average rating", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Average of 5 and 4 = 4.5
      expect(getByText("Average Rating:")).toBeInTheDocument();
    });

    expect(getByText("John Doe")).toBeInTheDocument();
    expect(getByText("Jane Smith")).toBeInTheDocument();
    expect(getByText(/5 \/ 5/)).toBeInTheDocument();
    expect(getByText(/4 \/ 5/)).toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("Network error"))
    );

    const { getByText, getByRole } = render(
      <MemoryRouter initialEntries={["/products/999"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Error")).toBeInTheDocument();
      expect(getByText("Network error")).toBeInTheDocument();
    });

    expect(getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("handles HTTP 404 error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.reject(new Error("Not found")),
      })
    );

    const { getByText, getByRole } = render(
      <MemoryRouter initialEntries={["/products/999"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText(/Product not found/)).toBeInTheDocument();
    });

    expect(getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("back button navigates to products page", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByRole } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      const backBtn = getByRole("button", { name: "Back to Products" });
      fireEvent.click(backBtn);
    });
  });

  it("retry button re-triggers the fetch call", async () => {
    let callCount = 0;
    global.fetch = jest.fn(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error("Network error"));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      });
    });

    const { getByRole, getByText, getByAltText } = render(
      <MemoryRouter initialEntries={["/products/999"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Error")).toBeInTheDocument();
    });

    fireEvent.click(getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(getByAltText("iPhone 9")).toBeInTheDocument();
    });
  });

  it("calculates and displays average rating from reviews", async () => {
    const productWithRatings = {
      ...mockProduct,
      reviews: [
        {
          rating: 3,
          comment: "Average product.",
          date: "2026-01-01T10:00:00.000Z",
          reviewerName: "Test User",
          reviewerEmail: "test@example.com",
        },
        {
          rating: 5,
          comment: "Excellent!",
          date: "2026-02-01T10:00:00.000Z",
          reviewerName: "Happy Customer",
          reviewerEmail: "happy@example.com",
        },
        {
          rating: 4,
          comment: "Good value.",
          date: "2026-03-01T10:00:00.000Z",
          reviewerName: "Smart Buyer",
          reviewerEmail: "smart@example.com",
        },
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(productWithRatings),
      })
    );

    const { getByText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Average of 3, 5, 4 = 4.0
      expect(getByText(/4\.0/)).toBeInTheDocument();
    });
  });

  it("renders dimensions and weight information", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Width")).toBeInTheDocument();
      expect(getByText("Height")).toBeInTheDocument();
      expect(getByText("Depth")).toBeInTheDocument();
      expect(getByText("Weight")).toBeInTheDocument();
    });

    expect(getByText("21.2")).toBeInTheDocument();
    expect(getByText("20.5")).toBeInTheDocument();
    expect(getByText("8.3")).toBeInTheDocument();
    expect(getByText("4")).toBeInTheDocument();
  });

  it("renders the minimum order quantity", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProduct),
      })
    );

    const { getByText } = render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <ProductDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Minimum Order")).toBeInTheDocument();
      expect(getByText("1")).toBeInTheDocument();
    });
  });
});