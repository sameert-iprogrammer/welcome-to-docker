import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );
  });

  it("renders Dashboard and Orders nav links", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );
    expect(getByText("Dashboard")).toBeInTheDocument();
    expect(getByText("Orders")).toBeInTheDocument();
  });

  it("collapses and expands on toggle button click", () => {
    const { container, getByLabelText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );
    const sidebar = container.querySelector(".sidebar");
    expect(sidebar).not.toHaveClass("sidebar--collapsed");

    const toggleBtn = getByLabelText("Collapse sidebar");
    fireEvent.click(toggleBtn);
    expect(sidebar).toHaveClass("sidebar--collapsed");

    const expandBtn = getByLabelText("Expand sidebar");
    fireEvent.click(expandBtn);
    expect(sidebar).not.toHaveClass("sidebar--collapsed");
  });

  it("applies active class to the current path nav item", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Sidebar />
      </MemoryRouter>
    );
    const navItems = container.querySelectorAll(".sidebar-nav-item");
    expect(navItems[1]).toHaveClass("sidebar-nav-item--active");
    expect(navItems[0]).not.toHaveClass("sidebar-nav-item--active");
  });
});
