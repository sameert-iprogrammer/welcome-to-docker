import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
  });

  it("contains pie chart heading", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Resource Distribution")).toBeInTheDocument();
  });

  it("contains bar chart heading", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Monthly Activity")).toBeInTheDocument();
  });

  it("renders at least one SVG element", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders pie legend label", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Containers")).toBeInTheDocument();
  });

  it("renders bar chart label", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Jan")).toBeInTheDocument();
  });

  it("contains CPU Usage heading", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("CPU Usage")).toBeInTheDocument();
  });

  it("contains Network Traffic heading", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Network Traffic")).toBeInTheDocument();
  });
});
