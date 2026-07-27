import React from "react";
import { render, screen } from "@testing-library/react";
import FAQModal from "./FAQModal";

describe("FAQModal", () => {
  test("renders FAQ modal when isOpen is true", () => {
    render(<FAQModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });

  test("does not render FAQ modal when isOpen is false", () => {
    render(<FAQModal isOpen={false} onClose={() => {}} />);
    
    expect(screen.queryByText("Frequently Asked Questions")).not.toBeInTheDocument();
  });
});