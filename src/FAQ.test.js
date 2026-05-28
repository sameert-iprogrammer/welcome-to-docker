import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FAQ from "./FAQ";

describe("FAQ", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/faq"]}>
        <FAQ />
      </MemoryRouter>
    );
  });

  it("renders the FAQ title", () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={["/faq"]}>
        <FAQ />
      </MemoryRouter>
    );
    expect(getByRole("heading", { name: "FAQ" })).toBeInTheDocument();
  });

  it("expands and collapses accordion items", () => {
    const { getByRole, queryByText } = render(
      <MemoryRouter initialEntries={["/faq"]}>
        <FAQ />
      </MemoryRouter>
    );

    const firstQuestion = getByRole("button", { name: /What is Docker\?/ });
    const secondQuestion = getByRole("button", {
      name: /How do I start a container\?/,
    });

    fireEvent.click(firstQuestion);
    expect(
      getByRole("region", { name: undefined })
    ).toHaveTextContent(/lightweight containers/);

    fireEvent.click(firstQuestion);
    expect(queryByText(/lightweight containers/)).not.toBeInTheDocument();

    fireEvent.click(secondQuestion);
    expect(getByRole("region")).toHaveTextContent(/docker run/);

    fireEvent.click(firstQuestion);
    expect(getByRole("region")).toHaveTextContent(/lightweight containers/);
    expect(queryByText(/docker run/)).not.toBeInTheDocument();
  });
});
