import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Products from "./Products";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

const mockApiData = {
  products: [
    {
      id: 1,
      sku: "SKU-100",
      title: "iPhone 9",
      description: "An apple mobile which is nothing like apple",
      price: 549,
      category: "electronics",
      brand: "PhoneCo",
    },
    {
      id: 2,
      sku: "SKU-101",
      title: "Samsung Galaxy S3",
      description: "A green phone that is not very green",
      price: 499,
      category: "electronics",
      brand: "GalaxyWorks",
    },
    {
      id: 3,
      sku: "SKU-102",
      title: "Electronics Phone Case",
      description: "A cheap phone case for electronics",
      price: 29.99,
      category: "accessories",
      brand: "CaseFactory",
    },
  ],
  total: 3,
  skip: 0,
  limit: 30,
};

describe("Products", () => {
  beforeEach(() => {
    toast.success.mockClear();
    global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve(mockApiData) });
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
  });

  it("renders product rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    // All 3 mock products fit on page 1 (PAGE_SIZE = 10)
    expect(getByText("iPhone 9")).toBeInTheDocument();
    expect(getByText("Samsung Galaxy S3")).toBeInTheDocument();
    expect(getByText("Electronics Phone Case")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search products");
    expect(searchInput).toBeInTheDocument();

    // Search by title
    fireEvent.change(searchInput, { target: { value: "iphone" } });
    expect(getByText("iPhone 9")).toBeInTheDocument();
    expect(queryByText("Samsung Galaxy S3")).not.toBeInTheDocument();
    expect(queryByText("Electronics Phone Case")).not.toBeInTheDocument();

    // Search by SKU
    fireEvent.change(searchInput, { target: { value: "SKU-100" } });
    expect(getByText("iPhone 9")).toBeInTheDocument();
    expect(queryByText("Samsung Galaxy S3")).not.toBeInTheDocument();

    // Search by category
    fireEvent.change(searchInput, { target: { value: "furniture" } });
    expect(queryByText("iPhone 9")).not.toBeInTheDocument();
    expect(queryByText("Samsung Galaxy S3")).not.toBeInTheDocument();
    expect(queryByText("Electronics Phone Case")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search products");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no products found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    // All 3 products fit on page 1 (PAGE_SIZE = 10)
    expect(getByLabelText("Previous page")).toBeDisabled();
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    // Search for something
    const searchInput = getByLabelText("Search products");
    fireEvent.change(searchInput, { target: { value: "iphone" } });

    // Should be on page 1
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("iPhone 9")).toBeInTheDocument();
  });

  it("renders an Add Product button that is disabled", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    const btn = getByLabelText("Add product");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute(
      "title",
      "Add product feature is currently unavailable with live API data."
    );
  });

  it("does not open modal when disabled Add Product is clicked", () => {
    const { getByLabelText, queryByLabelText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add product"));

    // Modal should not open because button is disabled
    expect(queryByLabelText("Add Product")).toBeNull();
    expect(queryByLabelText("SKU")).toBeNull();
    expect(queryByLabelText("Name")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
    expect(queryByText("Test Product")).toBeNull();
  });
});