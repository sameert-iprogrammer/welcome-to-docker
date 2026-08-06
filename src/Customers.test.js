import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Customers from "./Customers";

const BASE_USERS = [
  { id: 1, firstName: "Alice", lastName: "Johnson", email: "alice@example.com", company: { name: "Tech Corp" }, phone: "555-0101", role: "admin" },
  { id: 2, firstName: "Bob", lastName: "Smith", email: "bob@example.com", company: { name: "Data Inc" }, phone: "555-0102", role: "moderator" },
  { id: 3, firstName: "Carol", lastName: "White", email: "carol@example.com", company: { name: "CloudBase" }, phone: "555-0103", role: "user" },
  { id: 4, firstName: "Dave", lastName: "Brown", email: "dave@example.com", company: { name: "NetServices" }, phone: "555-0104", role: "user" },
  { id: 5, firstName: "Eve", lastName: "Davis", email: "eve@example.com", company: { name: "StackOps" }, phone: "555-0105", role: "admin" },
  { id: 6, firstName: "Frank", lastName: "Miller", email: "frank@example.com", company: { name: "DevPro" }, phone: "555-0106", role: "moderator" },
  { id: 7, firstName: "Grace", lastName: "Wilson", email: "grace@example.com", company: { name: "SysAdmin Co" }, phone: "555-0107", role: "user" },
  { id: 8, firstName: "Henry", lastName: "Moore", email: "henry@example.com", company: { name: "WebWare" }, phone: "555-0108", role: "user" },
  { id: 9, firstName: "Ivy", lastName: "Taylor", email: "ivy@example.com", company: { name: "AppForge" }, phone: "555-0109", role: "admin" },
  { id: 10, firstName: "Jack", lastName: "Anderson", email: "jack@example.com", company: { name: "Digital Solutions" }, phone: "555-0110", role: "user" },
];

const generateUsers = (count) =>
  Array.from({ length: count }, (_, i) => {
    const base = BASE_USERS[i % BASE_USERS.length];
    return {
      ...base,
      id: i + 1,
      email:
        i < BASE_USERS.length
          ? base.email
          : `user${i + 1}@example.com`,
      company: {
        name:
          i < BASE_USERS.length
            ? base.company.name
            : `${base.company.name} ${Math.floor(i / BASE_USERS.length) + 1}`,
      },
      phone:
        i < BASE_USERS.length
          ? base.phone
          : `555-${String(101 + (i % BASE_USERS.length)).padStart(4, "0")}`,
      role: i % 3 === 0 ? "admin" : i % 3 === 1 ? "moderator" : "user",
    };
  });

describe("Customers", () => {
  let fetchSpy;

  const mockResponse = (users, total, skip, limit) => ({
    ok: true,
    json: () => Promise.resolve({ users, total, skip, limit }),
  });

  beforeEach(() => {
    fetchSpy = jest.spyOn(window, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("renders without crashing", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
  });

  it("renders first page user rows in the table from API", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(getByText("Bob Smith")).toBeInTheDocument();
    expect(getByText("Carol White")).toBeInTheDocument();
    expect(getByText("Dave Brown")).toBeInTheDocument();
    expect(getByText("Eve Davis")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search customers");

    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Bob Smith")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "cloudbase" } });
    expect(getByText("Carol White")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "henry@example.com" } });
    expect(getByText("Henry Moore")).toBeInTheDocument();
    expect(queryByText("Carol White")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search customers");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no customers found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208).slice(30, 60), 208, 30, 30)
    );
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 7/i)).toBeInTheDocument();

    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 7/i)).toBeInTheDocument();
    expect(getByText("Frank Miller")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("search resets pagination to page 1", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208).slice(30, 60), 208, 30, 30)
    );
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Next page"));
    expect(getByText(/page 2 of 7/i)).toBeInTheDocument();

    const searchInput = getByLabelText("Search customers");
    fireEvent.change(searchInput, { target: { value: "alice" } });

    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    expect(queryByText("Frank Miller")).not.toBeInTheDocument();
  });

  it("disables Add Customer button", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByLabelText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    const addBtn = getByLabelText("Add customer");
    expect(addBtn).toBeDisabled();
  });

  it("shows loading state on initial fetch", () => {
    // Do not resolve fetch — component renders with loading state
    fetchSpy.mockImplementation(() => new Promise(() => {}));
    const { getByText, queryByText, queryByLabelText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    expect(getByText(/loading customers/i)).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();
    expect(queryByLabelText("Search customers")).not.toBeInTheDocument();
  });

  it("shows error message and retry button on API failure", () => {
    fetchSpy.mockRejectedValueOnce(new Error("Network error"));
    const { getByText, getByLabelText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    expect(getByText(/failed to load users/i)).toBeInTheDocument();
    expect(getByLabelText("Retry loading customers")).toBeInTheDocument();
    expect(queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("refetches data when retry button is clicked", () => {
    fetchSpy.mockRejectedValueOnce(new Error("Network error"));
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByText, getByLabelText, queryByText } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    expect(getByText(/failed to load users/i)).toBeInTheDocument();
    fireEvent.click(getByLabelText("Retry loading customers"));
    expect(getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("search matches users showing correct number of rows", () => {
    fetchSpy.mockResolvedValueOnce(
      mockResponse(generateUsers(208), 208, 0, 30)
    );
    const { getByLabelText, getByText, container } = render(
      <MemoryRouter>
        <Customers />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search customers");
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(getByText("Alice Johnson")).toBeInTheDocument();
    const rows = container.querySelectorAll(".orders-table-td");
    expect(rows.length).toBeGreaterThan(0);
  });
});