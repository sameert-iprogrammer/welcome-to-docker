import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sessions from "./Sessions";

describe("Sessions", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );
  });

  it("renders first page rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );
    expect(getByText("alice@example.com")).toBeInTheDocument();
    expect(getByText("bob@example.com")).toBeInTheDocument();
    expect(getByText("carol@example.com")).toBeInTheDocument();
    expect(getByText("dave@example.com")).toBeInTheDocument();
    expect(getByText("eve@example.com")).toBeInTheDocument();
  });

  it("shows Active for sessions with null logoutTime", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );
    expect(getByText("Active")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search sessions");

    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("alice@example.com")).toBeInTheDocument();
    expect(queryByText("bob@example.com")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Windows" } });
    expect(getByText("dave@example.com")).toBeInTheDocument();
    expect(getByText("alice@example.com")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "active" } });
    expect(getByText("bob@example.com")).toBeInTheDocument();
    expect(getByText("eve@example.com")).toBeInTheDocument();
    expect(queryByText("alice@example.com")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "chrome" } });
    expect(getByText("alice@example.com")).toBeInTheDocument();
    expect(getByText("carol@example.com")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search sessions");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no sessions found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );

    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 3/i)).toBeInTheDocument();

    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();
    expect(getByText("frank@example.com")).toBeInTheDocument();
    expect(queryByText("alice@example.com")).not.toBeInTheDocument();

    fireEvent.click(nextBtn);
    expect(getByText(/page 3 of 3/i)).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Next page"));
    expect(getByText(/page 2 of 3/i)).toBeInTheDocument();

    const searchInput = getByLabelText("Search sessions");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("alice@example.com")).toBeInTheDocument();
    expect(queryByText("bob@example.com")).not.toBeInTheDocument();
  });
});