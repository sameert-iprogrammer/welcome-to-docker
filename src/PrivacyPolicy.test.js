import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import privacyPolicyMock from "./privacyPolicyMock";

describe("PrivacyPolicy", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/privacy"]}>
        <PrivacyPolicy />
      </MemoryRouter>
    );
  });

  it("renders the main heading with mock title", () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={["/privacy"]}>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(
      getByRole("heading", { name: privacyPolicyMock.title, level: 1 })
    ).toBeInTheDocument();
  });

  it("renders section heading and body text from mock data", () => {
    const { getByRole, getByText } = render(
      <MemoryRouter initialEntries={["/privacy"]}>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    const firstSection = privacyPolicyMock.sections[0];
    expect(
      getByRole("heading", { name: firstSection.heading, level: 3 })
    ).toBeInTheDocument();
    expect(getByText(firstSection.body)).toBeInTheDocument();
  });

  it("renders back to sign in control", () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={["/privacy"]}>
        <PrivacyPolicy />
      </MemoryRouter>
    );
    expect(getByRole("button", { name: "Back to Sign In" })).toBeInTheDocument();
  });
});
