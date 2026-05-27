import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Profile from "./Profile";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

const renderProfile = () =>
  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <Profile />
    </MemoryRouter>
  );

describe("Profile", () => {
  beforeEach(() => {
    toast.success.mockClear();
  });

  it("renders read-only fields with mock values and an Edit button", () => {
    const { getByText, getByLabelText, queryByLabelText } = renderProfile();
    expect(getByText("Jane Doe")).toBeInTheDocument();
    expect(getByText("jane@example.com")).toBeInTheDocument();
    expect(getByLabelText("Edit profile")).toBeInTheDocument();
    expect(queryByLabelText("Full Name")).toBeNull();
  });

  it("reveals editable inputs and Update/Cancel when Edit is clicked", () => {
    const { getByLabelText, queryByLabelText } = renderProfile();
    fireEvent.click(getByLabelText("Edit profile"));

    expect(getByLabelText("Full Name").tagName).toBe("INPUT");
    expect(getByLabelText("Email").tagName).toBe("INPUT");
    expect(getByLabelText("Username").tagName).toBe("INPUT");
    expect(getByLabelText("Bio").tagName).toBe("TEXTAREA");
    expect(getByLabelText("Update profile")).toBeInTheDocument();
    expect(getByLabelText("Cancel edit")).toBeInTheDocument();
    expect(queryByLabelText("Edit profile")).toBeNull();
  });

  it("updates the profile and fires toast.success on Update", () => {
    const { getByLabelText, getByText, queryByText } = renderProfile();
    fireEvent.click(getByLabelText("Edit profile"));

    const nameInput = getByLabelText("Full Name");
    fireEvent.change(nameInput, { target: { value: "Janet Smith" } });

    fireEvent.click(getByLabelText("Update profile"));

    expect(getByText("Janet Smith")).toBeInTheDocument();
    expect(queryByText("Jane Doe")).toBeNull();
    expect(getByLabelText("Edit profile")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
  });

  it("discards changes when Cancel is clicked", () => {
    const { getByLabelText, getByText, queryByText } = renderProfile();
    fireEvent.click(getByLabelText("Edit profile"));

    fireEvent.change(getByLabelText("Full Name"), {
      target: { value: "Temporary Name" },
    });
    fireEvent.click(getByLabelText("Cancel edit"));

    expect(getByText("Jane Doe")).toBeInTheDocument();
    expect(queryByText("Temporary Name")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
  });
});
