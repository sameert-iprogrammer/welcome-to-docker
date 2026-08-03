import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Promotions from "./Promotions";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

describe("Promotions", () => {
  beforeEach(() => {
    toast.success.mockClear();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );
  });

  it("renders first page rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );
    // Page 1 shows first 5 promotions
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(getByText("Black Friday Sale")).toBeInTheDocument();
    expect(getByText("Back to School")).toBeInTheDocument();
    expect(getByText("New Year Flash Sale")).toBeInTheDocument();
    expect(getByText("Winter Clearance")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search promotions");
    expect(searchInput).toBeInTheDocument();

    // Search by name
    fireEvent.change(searchInput, { target: { value: "summer" } });
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(queryByText("Black Friday Sale")).not.toBeInTheDocument();

    // Search by discount type
    fireEvent.change(searchInput, { target: { value: "fixed amount" } });
    expect(getByText("New Year Flash Sale")).toBeInTheDocument();
    expect(getByText("Member Exclusive")).toBeInTheDocument();
    expect(queryByText("Summer Sale")).not.toBeInTheDocument();

    // Search by status
    fireEvent.change(searchInput, { target: { value: "upcoming" } });
    expect(getByText("Black Friday Sale")).toBeInTheDocument();
    expect(queryByText("Summer Sale")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search promotions");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no promotions found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Promotions />
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
    // Page 2 shows items 6-10
    expect(getByText("Free Shipping Weekend")).toBeInTheDocument();
    expect(queryByText("Back to School")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    // Navigate to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();

    // Search for something
    const searchInput = getByLabelText("Search promotions");
    fireEvent.change(searchInput, { target: { value: "summer" } });

    // Should be back on page 1, showing only Summer Sale
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(queryByText("Black Friday Sale")).not.toBeInTheDocument();
  });

  it("renders an Add Promotion button", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );
    expect(getByLabelText("Add promotion")).toBeInTheDocument();
  });

  it("opens the modal with empty form fields on Add Promotion click", () => {
    const { getByLabelText, getByRole } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add promotion"));

    expect(getByRole("heading", { name: /Add Promotion/i })).toBeInTheDocument();
    expect(getByLabelText("Name").value).toBe("");
    expect(getByLabelText("Description").value).toBe("");
    expect(getByLabelText("Start Date").value).toBe("");
    expect(getByLabelText("End Date").value).toBe("");
    expect(getByLabelText("Discount Type").value).toBe("");
    expect(getByLabelText("Discount Value").value).toBe("");
    expect(getByLabelText("Status").value).toBe("Draft");
    expect(getByLabelText("Save promotion")).toBeInTheDocument();
    expect(getByLabelText("Cancel add promotion")).toBeInTheDocument();
  });

  it("closes the modal without saving when Cancel is clicked", () => {
    const { getByLabelText, container } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add promotion"));
    expect(container.querySelector(".product-modal")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel add promotion"));

    expect(container.querySelector(".product-modal")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("saves a new promotion, fires toast, closes modal, and shows the row", () => {
    const { getByLabelText, container, getByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add promotion"));
    fireEvent.change(getByLabelText("Name"), {
      target: { value: "Test Promotion" },
    });
    fireEvent.change(getByLabelText("Description"), {
      target: { value: "Test description" },
    });
    fireEvent.change(getByLabelText("Start Date"), {
      target: { value: "2025-06-01" },
    });
    fireEvent.change(getByLabelText("End Date"), {
      target: { value: "2025-06-30" },
    });
    fireEvent.change(getByLabelText("Discount Type"), {
      target: { value: "Percentage" },
    });
    fireEvent.change(getByLabelText("Discount Value"), {
      target: { value: "15" },
    });

    fireEvent.click(getByLabelText("Save promotion"));

    expect(container.querySelector(".product-modal")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Promotion added successfully");

    // Filter to surface the newly-added row regardless of pagination position.
    fireEvent.change(getByLabelText("Search promotions"), {
      target: { value: "Test Promotion" },
    });
    expect(getByText("Test Promotion")).toBeInTheDocument();
    expect(getByText("Test description")).toBeInTheDocument();
    expect(getByText("2025-06-01")).toBeInTheDocument();
    expect(getByText("2025-06-30")).toBeInTheDocument();
    expect(getByText("Percentage")).toBeInTheDocument();
    expect(getByText("15")).toBeInTheDocument();
  });
});