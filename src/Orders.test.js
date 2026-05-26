import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Orders from "./Orders";

describe("Orders", () => {
  const mockNavigateTo = jest.fn();

  it("renders without crashing", () => {
    render(<Orders navigateTo={mockNavigateTo} />);
  });

  it("renders all 5 mock order rows in the table", () => {
    const { getByText } = render(<Orders navigateTo={mockNavigateTo} />);
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
      <Orders navigateTo={mockNavigateTo} />
    );

    const searchInput = getByLabelText("Search orders");
    expect(searchInput).toBeInTheDocument();

    // Search by customer name
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("ORD-001")).toBeInTheDocument();
    expect(queryByText("ORD-002")).not.toBeInTheDocument();

    // Search by product
    fireEvent.change(searchInput, { target: { value: "compose" } });
    expect(getByText("ORD-002")).toBeInTheDocument();
    expect(queryByText("ORD-001")).not.toBeInTheDocument();

    // Search by status
    fireEvent.change(searchInput, { target: { value: "shipped" } });
    expect(getByText("ORD-001")).toBeInTheDocument();
    expect(getByText("ORD-005")).toBeInTheDocument();
    expect(queryByText("ORD-003")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <Orders navigateTo={mockNavigateTo} />
    );
    const searchInput = getByLabelText("Search orders");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no orders found/i)).toBeInTheDocument();
  });
});
