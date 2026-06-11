import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Orders from "./Orders";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

describe("Orders", () => {
  beforeEach(() => {
    toast.success.mockClear();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );
  });

  it("renders all 5 mock order rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );
    expect(getByText("ORD-001")).toBeInTheDocument();
    expect(getByText("ORD-002")).toBeInTheDocument();
    expect(getByText("ORD-003")).toBeInTheDocument();
    expect(getByText("ORD-004")).toBeInTheDocument();
    expect(getByText("ORD-005")).toBeInTheDocument();
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(getByText("Bob Smith")).toBeInTheDocument();
    expect(getByText("Docker Swarm")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search orders");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("ORD-001")).toBeInTheDocument();
    expect(queryByText("ORD-002")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "compose" } });
    expect(getByText("ORD-002")).toBeInTheDocument();
    expect(queryByText("ORD-001")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "shipped" } });
    expect(getByText("ORD-001")).toBeInTheDocument();
    expect(getByText("ORD-005")).toBeInTheDocument();
    expect(queryByText("ORD-003")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search orders");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no orders found/i)).toBeInTheDocument();
  });

  it("renders an Add Order button", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );
    expect(getByLabelText("Add order")).toBeInTheDocument();
  });

  it("opens the modal with empty form fields on Add Order click", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add order"));

    expect(getByLabelText("Add Order")).toBeInTheDocument();
    expect(getByLabelText("Customer").value).toBe("");
    expect(getByLabelText("Product").value).toBe("");
    expect(getByLabelText("Status").value).toBe("Pending");
    expect(getByLabelText("Date").value).toBe("");
    expect(getByLabelText("Save order")).toBeInTheDocument();
    expect(getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("saves a new order, fires toast, closes modal, and shows the row", () => {
    const { getByLabelText, queryByLabelText, getByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add order"));
    fireEvent.change(getByLabelText("Customer"), {
      target: { value: "Test Customer" },
    });
    fireEvent.change(getByLabelText("Product"), {
      target: { value: "Test Product" },
    });
    fireEvent.change(getByLabelText("Status"), {
      target: { value: "Pending" },
    });
    fireEvent.change(getByLabelText("Date"), {
      target: { value: "2026-06-01" },
    });

    fireEvent.click(getByLabelText("Save order"));

    expect(queryByLabelText("Add Order")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Order added successfully");

    fireEvent.change(getByLabelText("Search orders"), {
      target: { value: "Test Customer" },
    });
    expect(getByText("Test Customer")).toBeInTheDocument();
    expect(getByText("Test Product")).toBeInTheDocument();
    expect(getByText("ORD-006")).toBeInTheDocument();
  });

  it("renders Edit buttons for each row", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );
    expect(getAllByText("Edit")).toHaveLength(5);
  });

  it("opens the modal pre-filled on Edit click", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Edit order ORD-001"));

    expect(getByLabelText("Edit Order")).toBeInTheDocument();
    expect(getByLabelText("ID").value).toBe("ORD-001");
    expect(getByLabelText("Customer").value).toBe("Alice Johnson");
    expect(getByLabelText("Product").value).toBe("Docker Desktop");
    expect(getByLabelText("Status").value).toBe("Shipped");
    expect(getByLabelText("Date").value).toBe("2026-05-01");
    expect(getByLabelText("Update order")).toBeInTheDocument();
  });

  it("updates an order on Update, fires toast, closes modal, and shows updated row", () => {
    const { getByLabelText, getByText, queryByLabelText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Edit order ORD-001"));
    expect(getByLabelText("Edit Order")).toBeInTheDocument();

    fireEvent.change(getByLabelText("Customer"), {
      target: { value: "Edited Customer" },
    });

    fireEvent.click(getByLabelText("Update order"));

    expect(queryByLabelText("Edit Order")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Order updated successfully");
    expect(getByText("Edited Customer")).toBeInTheDocument();
    expect(getByText("ORD-001")).toBeInTheDocument();
  });

  it("renders Delete buttons for each row", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );
    expect(getAllByText("Delete")).toHaveLength(5);
  });

  it("opens confirmation dialog on Delete click", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Delete order ORD-001"));

    expect(getByText("Delete Order")).toBeInTheDocument();
    expect(
      getByText("Are you sure you want to delete ORD-001?")
    ).toBeInTheDocument();
    expect(getByLabelText("Delete")).toBeInTheDocument();
    expect(getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("closes confirmation dialog when Cancel is clicked", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Delete order ORD-001"));
    expect(getByText("Delete Order")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel"));

    expect(queryByText("Delete Order")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
    expect(getByText("ORD-001")).toBeInTheDocument();
  });

  it("deletes order on Confirm, fires toast, closes dialog, removes row", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Orders />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Delete order ORD-001"));
    expect(getByText("Delete Order")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Delete"));

    expect(toast.success).toHaveBeenCalledWith("Order deleted successfully");
    expect(queryByText("Delete Order")).toBeNull();
    expect(queryByText("ORD-001")).toBeNull();
  });
});
