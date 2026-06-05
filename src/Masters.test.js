import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";
import Masters from "./Masters";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

describe("Masters", () => {
  beforeEach(() => {
    toast.success.mockClear();
  });
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
  });

  it("renders first page rows in the table", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    expect(getByText("Electronics")).toBeInTheDocument();
    expect(getByText("Office Supplies")).toBeInTheDocument();
    expect(getByText("Furniture")).toBeInTheDocument();
    expect(getByText("Wireless Peripherals")).toBeInTheDocument();
    expect(getByText("Monitors")).toBeInTheDocument();
  });

  it("filters rows by search term (case-insensitive)", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    const searchInput = getByLabelText("Search masters");

    fireEvent.change(searchInput, { target: { value: "electronics" } });
    expect(getByText("Electronics")).toBeInTheDocument();
    expect(queryByText("Office Supplies")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "CAT-003" } });
    expect(getByText("Furniture")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "subcategory" } });
    expect(getByText("Wireless Peripherals")).toBeInTheDocument();
    expect(getByText("Monitors")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "inactive" } });
    expect(getByText("Monitors")).toBeInTheDocument();
    expect(getByText("Wearables")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();
  });

  it("shows no results message when search matches nothing", () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    const searchInput = getByLabelText("Search masters");
    fireEvent.change(searchInput, { target: { value: "zzzzz" } });
    expect(getByText(/no masters found/i)).toBeInTheDocument();
  });

  it("pagination controls render and work", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    const prevBtn = getByLabelText("Previous page");
    expect(prevBtn).toBeDisabled();
    expect(getByText(/page 1 of 4/i)).toBeInTheDocument();

    const nextBtn = getByLabelText("Next page");
    fireEvent.click(nextBtn);
    expect(getByText(/page 2 of 4/i)).toBeInTheDocument();
    expect(getByText("Accessories")).toBeInTheDocument();
    expect(queryByText("Electronics")).not.toBeInTheDocument();

    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    expect(getByText(/page 4 of 4/i)).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
  });

  it("search resets pagination to page 1", () => {
    const { getByLabelText, getByText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Next page"));
    expect(getByText(/page 2 of 4/i)).toBeInTheDocument();

    const searchInput = getByLabelText("Search masters");
    fireEvent.change(searchInput, { target: { value: "electronics" } });

    expect(getByText(/page 1 of 1/i)).toBeInTheDocument();
    expect(getByText("Electronics")).toBeInTheDocument();
    expect(queryByText("Accessories")).not.toBeInTheDocument();
  });

  it("renders an Add Master button", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    expect(getByLabelText("Add master")).toBeInTheDocument();
  });

  it("opens the modal with empty form fields on Add Master click", () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add master"));

    expect(getByLabelText("Add Master")).toBeInTheDocument();
    expect(getByLabelText("Code").value).toBe("");
    expect(getByLabelText("Name").value).toBe("");
    expect(getByLabelText("Description").value).toBe("");
    expect(getByLabelText("Type").value).toBe("Category");
    expect(getByLabelText("Status").value).toBe("Active");
    expect(getByLabelText("Save master")).toBeInTheDocument();
    expect(getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("closes the modal without saving when Cancel is clicked", () => {
    const { getByLabelText, queryByLabelText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add master"));
    expect(getByLabelText("Add Master")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel"));

    expect(queryByLabelText("Add Master")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
    expect(queryByText("Test Master")).toBeNull();
  });

  it("saves a new master, fires toast, closes modal, and shows the row", () => {
    const { getByLabelText, queryByLabelText, getByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getByLabelText("Add master"));
    fireEvent.change(getByLabelText("Code"), {
      target: { value: "CAT-TEST" },
    });
    fireEvent.change(getByLabelText("Name"), {
      target: { value: "Test Master" },
    });
    fireEvent.change(getByLabelText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(getByLabelText("Type"), {
      target: { value: "Category" },
    });
    fireEvent.change(getByLabelText("Status"), {
      target: { value: "Active" },
    });

    fireEvent.click(getByLabelText("Save master"));

    expect(queryByLabelText("Add Master")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Master added successfully");

    // Filter to surface the newly-added row
    fireEvent.change(getByLabelText("Search masters"), {
      target: { value: "Test Master" },
    });
    expect(getByText("Test Master")).toBeInTheDocument();
    expect(getByText("CAT-TEST")).toBeInTheDocument();
    expect(getByText("Test Description")).toBeInTheDocument();
  });

  it("renders Edit buttons for each row", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    expect(getAllByText("Edit")).toHaveLength(5);
  });

  it("opens the modal pre-filled on Edit click", () => {
    const { getByLabelText, getAllByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    // First row on page 1 is "Electronics"
    fireEvent.click(getAllByText("Edit")[0]);

    expect(getByLabelText("Edit Master")).toBeInTheDocument();
    expect(getByLabelText("Code").value).toBe("CAT-001");
    expect(getByLabelText("Name").value).toBe("Electronics");
    expect(getByLabelText("Description").value).toBe(
      "Electronic devices and components"
    );
    expect(getByLabelText("Type").value).toBe("Category");
    expect(getByLabelText("Status").value).toBe("Active");
    expect(getByLabelText("Update master")).toBeInTheDocument();
  });

  it("updates a master on Save, fires update toast, closes modal, and shows updated row", () => {
    const { getByLabelText, getAllByText, getByText, queryByLabelText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    // Click Edit on first row
    fireEvent.click(getAllByText("Edit")[0]);
    expect(getByLabelText("Edit Master")).toBeInTheDocument();

    // Modify the name field
    fireEvent.change(getByLabelText("Name"), {
      target: { value: "Edited Master" },
    });

    // Click Update
    fireEvent.click(getByLabelText("Update master"));

    expect(queryByLabelText("Edit Master")).toBeNull();
    expect(toast.success).toHaveBeenCalledWith("Master updated successfully");

    // Search for updated row
    fireEvent.change(getByLabelText("Search masters"), {
      target: { value: "Edited Master" },
    });
    expect(getByText("Edited Master")).toBeInTheDocument();
    expect(getByText("CAT-001")).toBeInTheDocument();
  });

  it("renders Delete buttons for each row", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );
    expect(getAllByText("Delete")).toHaveLength(5);
  });

  it("opens confirmation dialog on Delete click", () => {
    const { getAllByText, getByText, getByLabelText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getAllByText("Delete")[0]);

    expect(getByText("Delete Master")).toBeInTheDocument();
    expect(
      getByText("Are you sure you want to delete Electronics?")
    ).toBeInTheDocument();
    expect(getByLabelText("Delete")).toBeInTheDocument();
    expect(getByLabelText("Cancel")).toBeInTheDocument();
  });

  it("closes confirmation dialog when Cancel is clicked", () => {
    const { getAllByText, getByText, getByLabelText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getAllByText("Delete")[0]);
    expect(getByText("Delete Master")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Cancel"));

    expect(queryByText("Delete Master")).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
    expect(getByText("Electronics")).toBeInTheDocument();
  });

  it("deletes master on Confirm, fires toast, closes dialog, removes row", () => {
    const { getAllByText, getByText, getByLabelText, queryByText } = render(
      <MemoryRouter>
        <Masters />
      </MemoryRouter>
    );

    fireEvent.click(getAllByText("Delete")[0]);
    expect(getByText("Delete Master")).toBeInTheDocument();

    fireEvent.click(getByLabelText("Delete"));

    expect(toast.success).toHaveBeenCalledWith("Master deleted successfully");
    expect(queryByText("Delete Master")).toBeNull();
    expect(queryByText("Electronics")).toBeNull();
  });
});
