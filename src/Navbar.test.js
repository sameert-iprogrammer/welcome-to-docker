import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
  });

  it("renders profile button, settings button, and logout button", () => {
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    expect(getByLabelText("View profile")).toBeInTheDocument();
    expect(getByLabelText("Settings")).toBeInTheDocument();
    expect(getByLabelText("Log Out")).toBeInTheDocument();
  });

  it("shows confirmation dialog on logout click", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    fireEvent.click(getByLabelText("Log Out"));
    expect(getByText("Are you sure you want to log out?")).toBeInTheDocument();
    expect(getByText("Cancel")).toBeInTheDocument();
  });

  it("clears isAuthenticated from localStorage after confirming logout", () => {
    localStorage.setItem("isAuthenticated", "true");
    const { getAllByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    // Click the navbar "Log Out" button to open the confirmation dialog
    fireEvent.click(getAllByText("Log Out")[0]);
    // Click the dialog's "Log Out" confirm button (3rd "Log Out" match: navbar btn, dialog title, confirm btn)
    fireEvent.click(getAllByText("Log Out")[2]);
    expect(localStorage.getItem("isAuthenticated")).toBeNull();
  });

  it("does not logout when cancel is clicked", () => {
    localStorage.setItem("isAuthenticated", "true");
    const { getAllByText, getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Navbar />
      </MemoryRouter>
    );
    // Click the navbar "Log Out" button to open the confirmation dialog
    fireEvent.click(getAllByText("Log Out")[0]);
    // Click Cancel to dismiss the dialog
    fireEvent.click(getByText("Cancel"));
    // isAuthenticated should still be set (not logged out)
    expect(localStorage.getItem("isAuthenticated")).toBe("true");
  });
});
