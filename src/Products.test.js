import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Products from "./Products";

jest.mock("./Sidebar", () => () => <div data-testid="sidebar" />);

const mockProducts = [
  {
    id: 1,
    title: "Essence Mascara",
    category: "beauty",
    price: 9.99,
    thumbnail: "https://example.com/img1.jpg",
  },
  {
    id: 2,
    title: "iPhone 9",
    category: "smartphones",
    price: 499.99,
    thumbnail: "https://example.com/img2.jpg",
  },
];

const listResponse = {
  products: mockProducts,
  total: 20,
  skip: 0,
  limit: 10,
};

const emptyResponse = {
  products: [],
  total: 0,
  skip: 0,
  limit: 10,
};

function mockFetchSuccess(data) {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  );
}

function mockFetchReject(message = "Network error") {
  global.fetch = jest.fn(() => Promise.reject(new Error(message)));
}

describe("Products", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockFetchSuccess(listResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
  });

  it("shows loading state while fetch is pending", () => {
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve(listResponse),
              }),
            5000
          );
        })
    );

    const { getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );
    expect(getByText("Loading products...")).toBeInTheDocument();
  });

  it("renders API products after successful fetch", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Essence Mascara")).toBeInTheDocument();
    });
    expect(getByText("iPhone 9")).toBeInTheDocument();
    expect(getByText("beauty")).toBeInTheDocument();
    expect(getByText("$9.99")).toBeInTheDocument();
    expect(getByText("$499.99")).toBeInTheDocument();
  });

  it("search triggers debounced fetch to search endpoint", async () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    global.fetch.mockClear();
    mockFetchSuccess({ products: [mockProducts[1]], total: 1, skip: 0, limit: 10 });

    fireEvent.change(getByLabelText("Search products"), {
      target: { value: "phone" },
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const url = global.fetch.mock.calls[0][0];
      expect(url).toContain("/products/search?q=phone");
    });
  });

  it("pagination Next sends fetch with updated skip", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText("Essence Mascara")).toBeInTheDocument());

    global.fetch.mockClear();
    mockFetchSuccess({
      products: [{ id: 11, title: "Page 2 Item", category: "test", price: 1, thumbnail: "" }],
      total: 20,
      skip: 10,
      limit: 10,
    });

    fireEvent.click(getByLabelText("Next page"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const url = global.fetch.mock.calls[0][0];
      expect(url).toContain("skip=10");
    });
  });

  it("pagination Previous sends fetch with skip=0 from page 2", async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText("Essence Mascara")).toBeInTheDocument());

    global.fetch.mockClear();
    mockFetchSuccess({
      products: [{ id: 11, title: "Page 2 Item", category: "test", price: 1, thumbnail: "" }],
      total: 20,
      skip: 10,
      limit: 10,
    });

    fireEvent.click(getByLabelText("Next page"));
    await waitFor(() => expect(getByText("Page 2 Item")).toBeInTheDocument());

    global.fetch.mockClear();
    mockFetchSuccess(listResponse);

    fireEvent.click(getByLabelText("Previous page"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      const url = global.fetch.mock.calls[0][0];
      expect(url).toContain("skip=0");
    });
  });

  it("displays error state on fetch rejection", async () => {
    mockFetchReject("Network error");

    const { getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Network error")).toBeInTheDocument();
    });
    expect(getByText("Retry")).toBeInTheDocument();
  });

  it("shows empty message when API returns no products", async () => {
    mockFetchSuccess(emptyResponse);

    const { getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("No products found")).toBeInTheDocument();
    });
  });

  it("search resets pagination to page 1", async () => {
    mockFetchSuccess({
      products: [{ id: 11, title: "Page 2 Item", category: "test", price: 1, thumbnail: "" }],
      total: 20,
      skip: 10,
      limit: 10,
    });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText("Page 2 Item")).toBeInTheDocument());

    global.fetch.mockClear();
    mockFetchSuccess({ products: [mockProducts[0]], total: 1, skip: 0, limit: 10 });

    fireEvent.change(getByLabelText("Search products"), {
      target: { value: "mascara" },
    });

    act(() => {
      jest.advanceTimersByTime(400);
    });

    await waitFor(() => {
      const url = global.fetch.mock.calls[0][0];
      expect(url).toContain("skip=0");
    });
  });

  it("shows thumbnail fallback when image fails to load", async () => {
    mockFetchSuccess({
      products: [{ id: 99, title: "Broken Image", category: "test", price: 5, thumbnail: "bad.jpg" }],
      total: 1,
      skip: 0,
      limit: 10,
    });

    const { container, getByText } = render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitFor(() => expect(getByText("Broken Image")).toBeInTheDocument());

    const img = container.querySelector(".products-thumbnail");
    fireEvent.error(img);

    expect(container.querySelector(".products-thumbnail--fallback")).toBeInTheDocument();
  });
});
