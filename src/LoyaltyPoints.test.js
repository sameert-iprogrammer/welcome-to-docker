import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoyaltyPoints from "./LoyaltyPoints";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoyaltyPoints", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <LoyaltyPoints />
      </MemoryRouter>
    );
  });

  it("renders the title and sidebar", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoyaltyPoints />
      </MemoryRouter>
    );
    expect(getByText("Loyalty Rewards Program")).toBeInTheDocument();
    expect(getByText("Add Loyalty Points")).toBeInTheDocument();
  });

  it("renders step descriptions", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LoyaltyPoints />
      </MemoryRouter>
    );
    expect(getByText(/Sign up and create your account/i)).toBeInTheDocument();
    expect(getByText(/Earn 10 points/i)).toBeInTheDocument();
  });
});
