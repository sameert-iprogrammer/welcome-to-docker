import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Masters from "./Masters";

describe("Masters", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
  });

  it("renders first page rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    expect(getByText("Electronics")).toBeInTheDocument();
    expect(getByText("Office Supplies")).toBeInTheDocument();
    expect(getByText("Furniture")).toBeInTheDocument();
    expect(getByText("Wireless Peripherals")).toBeInTheDocument();
    expect(getByText("Monitors")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search masters");

    fireEvent.change(searchInput, { target: { value: "electronics" } });
    expect(getByText("Electronics")).toBeInTheDocument();
    expect(queryByText("Office Supplies")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "CAT-003" } });
    expect(getByText("Furniture")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "subcategory" } });
    expect(getByText("Wireless Peripherals")).toBeInTheDocument();
    expect(getByText("Monitors")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "inactive" } });
    expect(getByText("Monitors")).toBeInTheDocument();
    expect(getByText("Wearables")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search masters");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no masters found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 4/i)).toBeInTheDocument();

    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 4/i)).toBeInTheDocument();
    expect(getByText("Accessories")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();

    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    expect(getByText(/page 4 of 4/i)).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Next page"));
    expect(getByText(/page 2 of 4/i)).toBeInTheDocument();

    const searchInput = getByLabelText("Search masters");
    fireEvent.change(searchInput, { target: { value: "electronics" } });

    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Electronics")).toBeInTheDocument();
    expect(queryByText("Accessories")).not.toBeInTheDocument();
  });
});
