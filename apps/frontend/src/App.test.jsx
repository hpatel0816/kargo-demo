import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

// Helper to mock fetch with a successful API response
function mockFetchSuccess(data) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

// Helper to mock fetch with a network/HTTP error
function mockFetchError(status = 500) {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});


// --- Unit tests ---

describe("App — loading state", () => {
  it("shows loading indicator before fetch resolves", () => {
    global.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

describe("App — success state", () => {
  const apiResponse = {
    message: "Hello from the Kargo demo API!",
    version: "1.0.0",
    status: "ok",
  };

  beforeEach(() => mockFetchSuccess(apiResponse));

  it("renders the message from the API", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Hello from the Kargo demo API!/)).toBeInTheDocument()
    );
  });

  it("renders the version from the API", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/1\.0\.0/)).toBeInTheDocument()
    );
  });

  it("renders the status from the API", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/ok/)).toBeInTheDocument()
    );
  });
});

describe("App — error state", () => {
  it("shows an error message when the API returns a non-ok response", async () => {
    mockFetchError(500);
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    );
  });
});


// --- Regression tests ---

describe("App — regressions", () => {
  it("fetches /api/message on mount", async () => {
    mockFetchSuccess({ message: "hi", version: "1.0.0", status: "ok" });
    render(<App />);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith("/api/message"));
  });

  it("does not show loading state after fetch resolves", async () => {
    mockFetchSuccess({ message: "hi", version: "1.0.0", status: "ok" });
    render(<App />);
    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );
  });

  it("does not crash when all three fields are present", async () => {
    mockFetchSuccess({ message: "m", version: "v", status: "s" });
    render(<App />);
    await waitFor(() => expect(screen.getByText(/m/)).toBeInTheDocument());
  });
});
