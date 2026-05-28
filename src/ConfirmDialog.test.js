import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ConfirmDialog from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog isOpen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title, message, and buttons when isOpen is true", () => {
    const { getByText } = render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test message"
        confirmLabel="Yes"
        cancelLabel="No"
      />
    );
    expect(getByText("Test Title")).toBeInTheDocument();
    expect(getByText("Test message")).toBeInTheDocument();
    expect(getByText("Yes")).toBeInTheDocument();
    expect(getByText("No")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmDialog
        isOpen={true}
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />
    );
    fireEvent.click(getByText("Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
      <ConfirmDialog
        isOpen={true}
        cancelLabel="Cancel"
        onCancel={onCancel}
      />
    );
    fireEvent.click(getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when overlay is clicked", () => {
    const onCancel = jest.fn();
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onCancel={onCancel}
      />
    );
    fireEvent.click(container.querySelector(".confirm-dialog-overlay"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not call onCancel when dialog interior is clicked", () => {
    const onCancel = jest.fn();
    const { container } = render(
      <ConfirmDialog
        isOpen={true}
        onCancel={onCancel}
      />
    );
    fireEvent.click(container.querySelector(".confirm-dialog"));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
