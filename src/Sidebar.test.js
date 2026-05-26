import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  const mockNavigateTo = jest.fn();

  beforeEach(() => {
    mockNavigateTo.mockClear();
  });

  it("renders without crashing", () => {
    render(<Sidebar navigateTo={mockNavigateTo} currentPath="/dashboard" />);
  });

  it("renders Dashboard and Orders nav links", () => {
    const { getByText } = render(
      <Sidebar navigateTo={mockNavigateTo} currentPath="/dashboard" />
    );
    expect(getByText("Dashboard")).toBeInTheDocument();
    expect(getByText("Orders")).toBeInTheDocument();
  });

  it("collapses and expands on toggle button click", () => {
    const { container, getByLabelText } = render(
      <Sidebar navigateTo={mockNavigateTo} currentPath="/dashboard" />
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

  it("calls navigateTo with correct path on nav item click", () => {
    const { getByText } = render(
      <Sidebar navigateTo={mockNavigateTo} currentPath="/dashboard" />
    );
    fireEvent.click(getByText("Orders"));
    expect(mockNavigateTo).toHaveBeenCalledWith("/orders");

    fireEvent.click(getByText("Dashboard"));
    expect(mockNavigateTo).toHaveBeenCalledWith("/dashboard");
  });

  it("applies active class to the current path nav item", () => {
    const { container } = render(
      <Sidebar navigateTo={mockNavigateTo} currentPath="/orders" />
    );
    const navItems = container.querySelectorAll(".sidebar-nav-item");
    expect(navItems[1]).toHaveClass("sidebar-nav-item--active");
    expect(navItems[0]).not.toHaveClass("sidebar-nav-item--active");
  });
});
