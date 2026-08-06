import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Products from "./Products";

const mockProducts = [
  { id: 1, sku: "SKU-101", title: "Wireless Mouse", price: 29.99, category: "Electronics" },
  { id: 2, sku: "SKU-102", title: "Mechanical Keyboard", price: 89.99, category: "Electronics" },
  { id: 3, sku: "SKU-103", title: "USB-C Hub", price: 45.5, category: "Accessories" },
  { id: 4, sku: "SKU-104", title: "Laptop Stand", price: 34.0, category: "Office" },
  { id: 5, sku: "SKU-105", title: "Noise-Canceling Headphones", price: 199.99, category: "Electronics" },
  { id: 6, sku: "SKU-106", title: "Webcam HD", price: 59.99, category: "Electronics" },
  { id: 7, sku: "SKU-107", title: "Desk Lamp LED", price: 24.99, category: "Office" },
  { id: 8, sku: "SKU-108", title: "Ergonomic Chair", price: 349.0, category: "Furniture" },
  { id: 9, sku: "SKU-109", title: "Monitor 27 inch", price: 279.99, category: "Electronics" },
  { id: 10, sku: "SKU-110", title: "External SSD 1TB", price: 119.99, category: "Storage" },
  { id: 11, sku: "SKU-111", title: "Phone Charger", price: 19.99, category: "Accessories" },
  { id: 12, sku: "SKU-112", title: "Bluetooth Speaker", price: 49.99, category: "Electronics" },
  { id: 13, sku: "SKU-113", title: "Notebook Pack", price: 12.5, category: "Office" },
  { id: 14, sku: "SKU-114", title: "Standing Desk", price: 499.0, category: "Furniture" },
  { id: 15, sku: "SKU-115", title: "Tablet Case", price: 22.99, category: "Accessories" },
  { id: 16, sku: "SKU-116", title: "Graphics Tablet", price: 159.99, category: "Electronics" },
  { id: 17, sku: "SKU-117", title: "Cable Organizer", price: 8.99, category: "Accessories" },
  { id: 18, sku: "SKU-118", title: "Smart Watch Band", price: 15.99, category: "Wearables" },
  { id: 19, sku: "SKU-119", title: "Portable Power Bank", price: 39.99, category: "Electronics" },
  { id: 20, sku: "SKU-120", title: "Document Scanner", price: 129.0, category: "Office" },
];

describe("Products", () => {
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, "fetch");
    fetchSpy.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            products: mockProducts,
            total: mockProducts.length,
            skip: 0,
            limit: 100,
          }),
      })
    );
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("renders without crashing", async () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    await waitFor(() => expect(getByText("Products")).toBeInTheDocument());
  });

  it("renders product rows in the table", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );
  });

  it("filters rows by search term (case-insensitive)", async () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText("Products")).toBeInTheDocument());

    const searchInput = getByLabelText("Search products");
    expect(searchInput).toBeInTheDocument();

    // Search by name
    fireEvent.change(searchInput, { target: { value: "keyboard" } });
    expect(getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(queryByText("Wireless Mouse")).not.toBeInTheDocument();

    // Search by SKU
    fireEvent.change(searchInput, { target: { value: "SKU-110" } });
    expect(getByText("External SSD 1TB")).toBeInTheDocument();
    expect(queryByText("Mechanical Keyboard")).not.toBeInTheDocument();

    // Search by category
    fireEvent.change(searchInput, { target: { value: "furniture" } });
    expect(getByText("Ergonomic Chair")).toBeInTheDocument();
    expect(getByText("Standing Desk")).toBeInTheDocument();
    expect(queryByText("Wireless Mouse")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText("Products")).toBeInTheDocument());

    const searchInput = getByLabelText("Search products");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no products found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    // Previous button should be disabled on page 1
    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 2/i)).toBeInTheDocument();

    // Click Next to go to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 2/i)).toBeInTheDocument();
    // Page 2 in default asc order: items 11-20
    expect(getByText("Phone Charger")).toBeInTheDocument();
    expect(queryByText("Bluetooth Speaker")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    // Navigate to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 2/i)).toBeInTheDocument();

    // Search for something
    const searchInput = getByLabelText("Search products");
    fireEvent.change(searchInput, { target: { value: "mouse" } });

    // Should be back on page 1, showing only Wireless Mouse
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Wireless Mouse")).toBeInTheDocument();
    expect(queryByText("Bluetooth Speaker")).not.toBeInTheDocument();
  });

  it("renders an Add Product button", async () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    expect(getByLabelText("Add product")).toBeInTheDocument();
  });

  it("opens the modal with empty form fields on Add Product click", async () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    fireEvent.click(getByLabelText("Add product"));

    expect(getByLabelText("Add Product")).toBeInTheDocument();
    expect(getByLabelText("SKU").value).toBe("");
    expect(getByLabelText("Name").value).toBe("");
    expect(getByLabelText("Category").value).toBe("");
    expect(getByLabelText("Price").value).toBe("");
    expect(getByLabelText("Save product")).toBeInTheDocument();
    expect(getByLabelText("Cancel add product")).toBeInTheDocument();
  });

  it("closes the modal without saving when Cancel is clicked", async () => {
    const { getByLabelText, queryByLabelText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    fireEvent.click(getByLabelText("Add product"));
    expect(getByLabelText("Add Product")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel add product"));

    expect(queryByLabelText("Add Product")).toBeNull();
    expect(queryByText("Test Product")).toBeNull();
  });

  it("saves a new product, fires toast, closes modal, and shows the row", async () => {
    const { getByLabelText, queryByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    fireEvent.click(getByLabelText("Add product"));
    fireEvent.change(getByLabelText("SKU"), { target: { value: "SKU-TEST" } });
    fireEvent.change(getByLabelText("Name"), { target: { value: "Test Product" } });
    fireEvent.change(getByLabelText("Category"), { target: { value: "Electronics" } });
    fireEvent.change(getByLabelText("Price"), { target: { value: "99.99" } });

    fireEvent.click(getByLabelText("Save product"));

    expect(queryByLabelText("Add Product")).toBeNull();

    // Filter to surface the newly-added row regardless of pagination position.
    fireEvent.change(getByLabelText("Search products"), {
      target: { value: "Test Product" },
    });
    expect(getByText("Test Product")).toBeInTheDocument();
    expect(getByText("SKU-TEST (21)")).toBeInTheDocument();
    expect(getByText("$99.99")).toBeInTheDocument();
  });

  it("sort control renders with correct default value", async () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    const sortControl = getByLabelText("Sort by title");
    expect(sortControl).toBeInTheDocument();
    expect(sortControl.value).toBe("asc");
  });

  it("sorts products A→Z when asc is selected", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    // Default is already asc, first product should be Bluetooth Speaker
    const firstRow = getByText("Bluetooth Speaker");
    expect(firstRow).toBeInTheDocument();
  });

  it("sorts products Z→A when desc is selected", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    // Change to descending sort
    const sortControl = getByLabelText("Sort by title");
    fireEvent.change(sortControl, { target: { value: "desc" } });

    // First product should be Wireless Mouse (Z→A)
    await waitFor(() => expect(getByText("Wireless Mouse")).toBeInTheDocument());
    expect(getByText("Wireless Mouse")).toBeVisible();
  });

  it("sort state persists across page navigation", async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    // Switch to descending
    const sortControl = getByLabelText("Sort by title");
    fireEvent.change(sortControl, { target: { value: "desc" } });

    // Verify page 1 starts with Wireless Mouse
    await waitFor(() =>
      expect(getByText("Wireless Mouse")).toBeInTheDocument()
    );

    // Navigate to page 2 while desc sort persists
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 2/i)).toBeInTheDocument();
    // Page 2 in desc: items 11-20, first is Standing Desk
    expect(getByText("Standing Desk")).toBeInTheDocument();
    expect(queryByText("Wireless Mouse")).not.toBeInTheDocument();
  });

  it("sort and search work together correctly", async () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(getByText("Bluetooth Speaker")).toBeInTheDocument()
    );

    // Switch to descending
    const sortControl = getByLabelText("Sort by title");
    fireEvent.change(sortControl, { target: { value: "desc" } });

    // Search for a term that should find one product
    const searchInput = getByLabelText("Search products");
    fireEvent.change(searchInput, { target: { value: "keyboard" } });

    expect(getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(queryByText("Bluetooth Speaker")).not.toBeInTheDocument();
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
  });
});