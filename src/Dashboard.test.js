import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Dashboard from "./Dashboard";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

describe("Dashboard", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  });

  it("renders Recent Users heading", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Recent Users")).toBeInTheDocument();
  });

  it("renders 5 user rows in the table", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const rows = screen.getAllByRole("row");
    // 6 user rows (1 header + 5 data) + 6 order rows (1 header + 5 data) = 12 rows
    expect(rows.length).toBe(12);
  });

  it("renders 5 View buttons", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const viewButtons = screen.getAllByRole("button", { name: /view/i });
    expect(viewButtons.length).toBe(5);
  });

  it("shows modal with User Details when View is clicked", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const viewButtons = screen.getAllByRole("button", { name: /view/i });
    fireEvent.click(viewButtons[0]);
    expect(screen.getByText("User Details")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dismisses modal when Close is clicked", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const viewButtons = screen.getAllByRole("button", { name: /view/i });
    fireEvent.click(viewButtons[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders 5 Mark Active/Inactive buttons", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const markButtons = screen.getAllByRole("button", { name: /mark/i });
    expect(markButtons.length).toBe(5);
  });

  it("clicking Mark Inactive opens confirmation dialog", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const markButtons = screen.getAllByRole("button", { name: /mark/i });
    fireEvent.click(markButtons[0]);
    expect(screen.getByText("Confirm Status Change")).toBeInTheDocument();
  });

  it("clicking Cancel dismisses confirmation dialog", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const markButtons = screen.getAllByRole("button", { name: /mark/i });
    fireEvent.click(markButtons[0]);
    expect(screen.getByText("Confirm Status Change")).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(screen.queryByText("Confirm Status Change")).not.toBeInTheDocument();
  });

  it("clicking Confirm toggles status and shows toast", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const markButtons = screen.getAllByRole("button", { name: /mark/i });
    // First user (alice_w) is Active → button says "Mark Inactive"
    fireEvent.click(markButtons[0]);

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Status should have changed to Inactive
    const statusBadges = screen.getAllByText("Inactive");
    expect(statusBadges.length).toBeGreaterThanOrEqual(1);

    expect(toast.success).toHaveBeenCalled();
  });

  it("toggling one user does not affect others", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const markButtons = screen.getAllByRole("button", { name: /mark/i });
    // Toggle the first user (alice_w)
    fireEvent.click(markButtons[0]);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Second user (bob_dev) should still be Active
    const statusBadges = screen.getAllByText("Active");
    expect(statusBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Recent Orders heading", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Recent Orders")).toBeInTheDocument();
  });

  it("renders 5 order data rows (12 total rows including headers)", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const rows = screen.getAllByRole("row");
    // 6 user rows (1 header + 5 data) + 6 order rows (1 header + 5 data) = 12
    expect(rows.length).toBe(12);
  });

  it("shows modal with Order Details when order row is clicked", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const rows = screen.getAllByRole("row");
    // rows[0..5] are user header+data, rows[6] is order header, rows[7] is 1st order data row
    fireEvent.click(rows[7]);
    expect(screen.getByText("Order Details")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dismisses order modal when Close is clicked", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const rows = screen.getAllByRole("row");
    fireEvent.click(rows[7]);
    expect(screen.getByText("Order Details")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(screen.queryByText("Order Details")).not.toBeInTheDocument();
  });
});
