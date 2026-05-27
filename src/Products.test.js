import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Products from "./Products";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

describe("Products", () => {
  beforeEach(() => {
    toast.success.mockClear();
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
    // Page 1 shows first 10 products
    expect(getByText("Wireless Mouse")).toBeInTheDocument();
    expect(getByText("Mechanical Keyboard")).toBeInTheDocument();
    expect(getByText("USB-C Hub")).toBeInTheDocument();
    expect(getByText("Laptop Stand")).toBeInTheDocument();
    expect(getByText("Noise-Canceling Headphones")).toBeInTheDocument();
    expect(getByText("Webcam HD")).toBeInTheDocument();
    expect(getByText("Desk Lamp LED")).toBeInTheDocument();
    expect(getByText("Ergonomic Chair")).toBeInTheDocument();
    expect(getByText("Monitor 27 inch")).toBeInTheDocument();
    expect(getByText("External SSD 1TB")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

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
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    // Previous button should be disabled on page 1
    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 2/i)).toBeInTheDocument();

    // Click Next to go to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 2/i)).toBeInTheDocument();
    // Page 2 shows Phone Charger (product #11)
    expect(getByText("Bluetooth Speaker")).toBeInTheDocument();
    expect(queryByText("Wireless Mouse")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
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

  it("renders an Add Product button", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    expect(getByLabelText("Add product")).toBeInTheDocument();
  });

  it("opens the modal with empty form fields on Add Product click", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
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

  it("closes the modal without saving when Cancel is clicked", () => {
    const { getByLabelText, queryByLabelText, queryByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add product"));
    expect(getByLabelText("Add Product")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel add product"));

    expect(queryByLabelText("Add Product")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
    expect(queryByText("Test Product")).toBeNull();
  });

  it("saves a new product, fires toast, closes modal, and shows the row", () => {
    const { getByLabelText, queryByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add product"));
    fireEvent.change(getByLabelText("SKU"), { target: { value: "SKU-TEST" } });
    fireEvent.change(getByLabelText("Name"), { target: { value: "Test Product" } });
    fireEvent.change(getByLabelText("Category"), { target: { value: "Electronics" } });
    fireEvent.change(getByLabelText("Price"), { target: { value: "99.99" } });

    fireEvent.click(getByLabelText("Save product"));

    expect(queryByLabelText("Add Product")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Product added successfully");

    // Filter to surface the newly-added row regardless of pagination position.
    fireEvent.change(getByLabelText("Search products"), {
      target: { value: "Test Product" },
    });
    expect(getByText("Test Product")).toBeInTheDocument();
    expect(getByText("SKU-TEST (21)")).toBeInTheDocument();
    expect(getByText("$99.99")).toBeInTheDocument();
  });
});
