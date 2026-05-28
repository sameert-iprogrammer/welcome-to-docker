import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Sidebar", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

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
    expect(getByText("FAQ")).toBeInTheDocument();
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
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={["/orders"]}>
        <Sidebar />
      </MemoryRouter>
    );
    expect(getByLabelText("Orders")).toHaveClass("sidebar-nav-item--active");
    expect(getByLabelText("Dashboard")).not.toHaveClass(
      "sidebar-nav-item--active"
    );
  });

  it("applies active class to FAQ when on /faq", () => {
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={["/faq"]}>
        <Sidebar />
      </MemoryRouter>
    );
    expect(getByLabelText("FAQ")).toHaveClass("sidebar-nav-item--active");
  });

  it("renders Masters nav item and navigates to /masters on click", () => {
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>
    );
    expect(getByText("Masters")).toBeInTheDocument();
    fireEvent.click(getByLabelText("Masters"));
    expect(mockNavigate).toHaveBeenCalledWith("/masters");
  });
});
