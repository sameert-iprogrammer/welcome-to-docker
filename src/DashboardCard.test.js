import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DashboardCard from "./DashboardCard";

describe("DashboardCard", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <DashboardCard />
      </MemoryRouter>
    );
  });

  it("renders the heading text", () => {
    const { getByText } = render(
      <MemoryRouter>
        <DashboardCard />
      </MemoryRouter>
    );
    expect(getByText("Enter your team name")).toBeInTheDocument();
    expect(getByText("NOT STARTED")).toBeInTheDocument();
  });
});
