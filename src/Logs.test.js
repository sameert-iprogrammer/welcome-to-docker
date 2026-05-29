import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Logs from "./Logs";

describe("Logs", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Logs />
      </MemoryRouter>
    );
  });

  it("renders first page of mock log rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Logs />
      </MemoryRouter>
    );
    // Page 1 shows LOG-001 through LOG-005
    expect(getByText("LOG-001")).toBeInTheDocument();
    expect(getByText("LOG-002")).toBeInTheDocument();
    expect(getByText("LOG-003")).toBeInTheDocument();
    expect(getByText("LOG-004")).toBeInTheDocument();
    expect(getByText("LOG-005")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive across fields)", () => {
    const { getByLabelText, queryByText, getByText } = render(
      <MemoryRouter>
        <Logs />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search logs");
    expect(searchInput).toBeInTheDocument();

    // Search by log ID
    fireEvent.change(searchInput, { target: { value: "LOG-011" } });
    expect(getByText("LOG-011")).toBeInTheDocument();
    expect(queryByText("LOG-001")).not.toBeInTheDocument();

    // Search by level
    fireEvent.change(searchInput, { target: { value: "ERROR" } });
    expect(getByText("LOG-001")).toBeInTheDocument();
    expect(getByText("LOG-005")).toBeInTheDocument();
    expect(getByText("LOG-011")).toBeInTheDocument();

    // Search by source
    fireEvent.change(searchInput, { target: { value: "auth-service" } });
    expect(getByText("LOG-001")).toBeInTheDocument();
    expect(getByText("LOG-007")).toBeInTheDocument();
    expect(getByText("LOG-014")).toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Logs />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search logs");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no logs found/i)).toBeInTheDocument();
  });

  it("paginates correctly: page 1 shows first 5, Next shows next 5", () => {
    const { getByText, queryByText, getByLabelText } = render(
      <MemoryRouter>
        <Logs />
      </MemoryRouter>
    );

    // Page 1: LOG-001 through LOG-005
    expect(getByText("LOG-001")).toBeInTheDocument();
    expect(getByText("LOG-005")).toBeInTheDocument();
    expect(queryByText("LOG-006")).not.toBeInTheDocument();

    // Click Next
    fireEvent.click(getByLabelText("Next page"));

    // Page 2: LOG-006 through LOG-010
    expect(getByText("LOG-006")).toBeInTheDocument();
    expect(getByText("LOG-010")).toBeInTheDocument();
    expect(queryByText("LOG-001")).not.toBeInTheDocument();
    expect(queryByText("LOG-011")).not.toBeInTheDocument();

    // Click Next again
    fireEvent.click(getByLabelText("Next page"));

    // Page 3: LOG-011 through LOG-014
    expect(getByText("LOG-011")).toBeInTheDocument();
    expect(getByText("LOG-014")).toBeInTheDocument();
    expect(queryByText("LOG-001")).not.toBeInTheDocument();
  });

  it("opens and closes the detail modal via view icon", () => {
    const { getByText, queryByText, getByLabelText } = render(
      <MemoryRouter>
        <Logs />
      </MemoryRouter>
    );

    // View icon should be present
    const viewBtn = getByLabelText("View details for LOG-001");
    expect(viewBtn).toBeInTheDocument();

    // Modal should not be visible initially
    expect(queryByText("Log Details — LOG-001")).not.toBeInTheDocument();

    // Click view icon to open modal
    fireEvent.click(viewBtn);
    expect(getByText("Log Details — LOG-001")).toBeInTheDocument();
    expect(getByText("192.168.1.100")).toBeInTheDocument();

    // Click close button to dismiss
    fireEvent.click(getByLabelText("Close log details"));
    expect(queryByText("Log Details — LOG-001")).not.toBeInTheDocument();
  });
});
