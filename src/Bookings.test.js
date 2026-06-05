import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Bookings from "./Bookings";

describe("Bookings", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );
  });

  it("renders mock booking rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );
    // Page 1 shows first 5 bookings
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(getByText("Bob Smith")).toBeInTheDocument();
    expect(getByText("Carol White")).toBeInTheDocument();
    expect(getByText("Dave Brown")).toBeInTheDocument();
    expect(getByText("Eve Davis")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search bookings");
    expect(searchInput).toBeInTheDocument();

    // Search by customer name
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Bob Smith")).not.toBeInTheDocument();

    // Search by service
    fireEvent.change(searchInput, { target: { value: "training" } });
    expect(getByText("Bob Smith")).toBeInTheDocument();
    expect(getByText("Frank Miller")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();

    // Search by status
    fireEvent.change(searchInput, { target: { value: "cancelled" } });
    expect(getByText("Eve Davis")).toBeInTheDocument();
    expect(queryByText("Bob Smith")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search bookings");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no bookings found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Bookings />
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
    // Page 2 shows Frank Miller (booking #6)
    expect(getByText("Frank Miller")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Bookings />
      </MemoryRouter>
    );

    // Navigate to page 2
    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();

    // Search for something
    const searchInput = getByLabelText("Search bookings");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    // Should be back on page 1, showing only Alice
    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Frank Miller")).not.toBeInTheDocument();
  });
});
