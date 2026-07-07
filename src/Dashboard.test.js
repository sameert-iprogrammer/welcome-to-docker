import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import { mockActiveSessions } from "./activeSessionsMock";

describe("Dashboard", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  });

  it("renders Active Sessions heading", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Active Sessions")).toBeInTheDocument();
  });

  it("renders all 5 mock session users in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    mockActiveSessions.forEach((session) => {
      expect(getByText(session.user)).toBeInTheDocument();
    });
  });

  it("still renders the metrics grid", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(getByText("Total Containers")).toBeInTheDocument();
    expect(getByText("Running")).toBeInTheDocument();
    expect(getByText("Images")).toBeInTheDocument();
    expect(getByText("Volumes")).toBeInTheDocument();
  });
});
