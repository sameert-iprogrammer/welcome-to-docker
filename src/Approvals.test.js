import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Approvals from "./Approvals";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

describe("Approvals", () => {
  beforeEach(() => {
    toast.success.mockClear();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );
  });

  it("renders the title Approvals", () => {
    const { container } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );
    expect(container.querySelector(".approvals-title")).toHaveTextContent("Approvals");
  });

  it("renders Approvals nav link in Sidebar", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );
    expect(getByLabelText("Approvals")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search approvals");
    expect(searchInput).toBeInTheDocument();

    // Search by requester name
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Bob Smith")).not.toBeInTheDocument();

    // Search by type
    fireEvent.change(searchInput, { target: { value: "travel" } });
    expect(getByText("Bob Smith")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();

    // Search by id
    fireEvent.change(searchInput, { target: { value: "APR-007" } });
    expect(getByText("Grace Wilson")).toBeInTheDocument();
    expect(queryByText("Bob Smith")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search approvals");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no approvals found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Approvals />
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
    // Page 2 shows Frank Miller (approval #6)
    expect(getByText("Frank Miller")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );

    // Navigate to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 2/i)).toBeInTheDocument();

    // Search for something
    const searchInput = getByLabelText("Search approvals");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    // Should be back on page 1, showing only Alice
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Frank Miller")).not.toBeInTheDocument();
  });

  it("clicking Approve button updates row status to Approved", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );

    // Find the Approve button for APR-001 (Alice Johnson, first row)
    const approveBtn = getByLabelText("Approve APR-001");
    expect(approveBtn).toBeInTheDocument();
    expect(approveBtn).not.toBeDisabled();
    expect(approveBtn.textContent).toBe("Approve");

    // Click Approve
    fireEvent.click(approveBtn);

    // Button text should now be "Approved" and disabled
    expect(approveBtn.textContent).toBe("Approved");
    expect(approveBtn).toBeDisabled();
    expect(toast.success).toHaveBeenCalledWith("Approved APR-001");
  });

  it("disables Approve button for already approved rows", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Approvals />
      </MemoryRouter>
    );

    // APR-002 (Bob Smith) is already "Approved" in mock data
    const approveBtn = getByLabelText("Approve APR-002");
    expect(approveBtn).toBeDisabled();
    expect(approveBtn.textContent).toBe("Approved");
  });
});
