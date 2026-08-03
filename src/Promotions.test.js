import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Promotions from "./Promotions";

describe("Promotions", () => {
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
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(getByText("Winter Clearance")).toBeInTheDocument();
    expect(getByText("Spring Special")).toBeInTheDocument();
    expect(getByText("Black Friday Deal")).toBeInTheDocument();
    expect(getByText("New Year Offer")).toBeInTheDocument();
  });

  it("search filters results", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search promotions");

    fireEvent.change(searchInput, { target: { value: "Active" } });
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(getByText("Winter Clearance")).toBeInTheDocument();
    expect(queryByText("Spring Special")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "SUMMER24" } });
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(queryByText("Winter Clearance")).not.toBeInTheDocument();
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

    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 3/i)).toBeInTheDocument();

    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();
    expect(getByText("Valentine Special")).toBeInTheDocument();
    expect(queryByText("Summer Sale")).not.toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(getByText(/page 3 of 3/i)).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Next page"));
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();

    const searchInput = getByLabelText("Search promotions");
    fireEvent.change(searchInput, { target: { value: "active" } });

    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Summer Sale")).toBeInTheDocument();
    expect(queryByText("Valentine Special")).not.toBeInTheDocument();
  });

  it("table displays all columns", () => {
    const { getAllByRole } = render(
      <MemoryRouter>
        <Promotions />
      </MemoryRouter>
    );

    const headers = getAllByRole("columnheader");
    expect(headers[0]).toHaveTextContent("ID");
    expect(headers[1]).toHaveTextContent("Code");
    expect(headers[2]).toHaveTextContent("Name");
    expect(headers[3]).toHaveTextContent("Discount");
    expect(headers[4]).toHaveTextContent("Start Date");
    expect(headers[5]).toHaveTextContent("End Date");
    expect(headers[6]).toHaveTextContent("Status");
  });
});