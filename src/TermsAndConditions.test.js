import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TermsAndConditions from "./TermsAndConditions";
import termsConditionsMock from "./termsConditionsMock";

describe("TermsAndConditions", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/terms"]}>
        <TermsAndConditions />
      </MemoryRouter>
    );
  });

  it("renders the main heading with mock title", () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={["/terms"]}>
        <TermsAndConditions />
      </MemoryRouter>
    );
    expect(
      getByRole("heading", { name: termsConditionsMock.title, level: 1 })
    ).toBeInTheDocument();
  });

  it("renders section heading and body text from mock data", () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={["/terms"]}>
        <TermsAndConditions />
      </MemoryRouter>
    );
    const firstSection = termsConditionsMock.sections[0];
    expect(
      getByRole("heading", { name: firstSection.heading, level: 3 })
    ).toBeInTheDocument();
    expect(getByText(firstSection.body)).toBeInTheDocument();
  });

  it("renders back to sign in control", () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={["/terms"]}>
        <TermsAndConditions />
      </MemoryRouter>
    );
    expect(getByRole("button", { name: "Back to Sign In" })).toBeInTheDocument();
  });
});
