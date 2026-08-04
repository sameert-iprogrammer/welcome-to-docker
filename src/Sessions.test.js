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

  it("renders sessions in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );
    expect(getByText("Docker Fundamentals")).toBeInTheDocument();
    expect(getByText("Kubernetes Basics")).toBeInTheDocument();
    expect(getByText("CI/CD with Docker")).toBeInTheDocument();
  });

  it("filters sessions by search term", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search sessions");

    fireEvent.change(searchInput, { target: { value: "kubernetes" } });
    expect(getByText("Kubernetes Basics")).toBeInTheDocument();
    expect(queryByText("Docker Fundamentals")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "completed" } });
    expect(getByText("Docker Fundamentals")).toBeInTheDocument();
    expect(queryByText("CI/CD with Docker")).toBeInTheDocument();
    expect(queryByText("Microservices with Docker")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Sessions />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search sessions");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText("No sessions found.")).toBeInTheDocument();
  });
});