import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Customers from "./Customers";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

describe("Customers", () => {
  beforeEach(() => {
    toast.success.mockClear();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
  });

  it("renders mock customer rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    // Page 1 shows first 5 customers
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(getByText("Bob Smith")).toBeInTheDocument();
    expect(getByText("Carol White")).toBeInTheDocument();
    expect(getByText("Dave Brown")).toBeInTheDocument();
    expect(getByText("Eve Davis")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search customers");
    expect(searchInput).toBeInTheDocument();

    // Search by name
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Bob Smith")).not.toBeInTheDocument();

    // Search by company
    fireEvent.change(searchInput, { target: { value: "cloudbase" } });
    expect(getByText("Carol White")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();

    // Search by email
    fireEvent.change(searchInput, { target: { value: "henry@example.com" } });
    expect(getByText("Henry Moore")).toBeInTheDocument();
    expect(queryByText("Carol White")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search customers");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no customers found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    // Previous button should be disabled on page 1
    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 3/i)).toBeInTheDocument();

    // Click Next to go to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();
    // Page 2 shows Frank Miller (customer #6)
    expect(getByText("Frank Miller")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    // Navigate to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();

    // Search for something
    const searchInput = getByLabelText("Search customers");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    // Should be back on page 1, showing only Alice
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Frank Miller")).not.toBeInTheDocument();
  });

  it("renders an Add Customer button", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    expect(getByLabelText("Add customer")).toBeInTheDocument();
  });

  it("opens the modal with empty form fields on Add Customer click", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add customer"));

    expect(getByLabelText("Add Customer")).toBeInTheDocument();
    expect(getByLabelText("Name").value).toBe("");
    expect(getByLabelText("Email").value).toBe("");
    expect(getByLabelText("Company").value).toBe("");
    expect(getByLabelText("Phone").value).toBe("");
    expect(getByLabelText("Status").value).toBe("Active");
    expect(getByLabelText("Save customer")).toBeInTheDocument();
    expect(getByLabelText("Cancel add customer")).toBeInTheDocument();
  });

  it("closes the modal without saving when Cancel is clicked", () => {
    const { getByLabelText, queryByLabelText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add customer"));
    expect(getByLabelText("Add Customer")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel add customer"));

    expect(queryByLabelText("Add Customer")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
    expect(queryByText("Zara Test")).toBeNull();
  });

  it("saves a new customer, fires toast, closes modal, and shows the row", () => {
    const { getByLabelText, queryByLabelText, getByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add customer"));
    fireEvent.change(getByLabelText("Name"), { target: { value: "Zara Test" } });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: "zara@example.com" },
    });
    fireEvent.change(getByLabelText("Company"), { target: { value: "TestCo" } });
    fireEvent.change(getByLabelText("Phone"), { target: { value: "555-9999" } });

    fireEvent.click(getByLabelText("Save customer"));

    expect(queryByLabelText("Add Customer")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Customer added successfully");

    // Filter to surface the newly-added row regardless of pagination position.
    fireEvent.change(getByLabelText("Search customers"), {
      target: { value: "Zara" },
    });
    expect(getByText("Zara Test")).toBeInTheDocument();
    expect(getByText("zara@example.com")).toBeInTheDocument();
    expect(getByText("TestCo")).toBeInTheDocument();
    expect(getByText("555-9999")).toBeInTheDocument();
  });
});
