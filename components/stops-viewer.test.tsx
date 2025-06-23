import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StopsViewer from "./stops-viewer";
import { getStaticStops } from "@/app/actions/actions";

vi.mock("@/app/actions/actions", () => ({
  getStaticStops: vi.fn(),
}));

vi.mock("./map", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-map">Map component</div>,
}));

vi.mock("./stop-card", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ stop }: any) => (
    <div data-testid="mock-stop-card">{stop.name}</div>
  ),
}));

describe("StopsViewer", () => {
  const mockStops = [
    { id: "1", name: "Plaça Catalunya" },
    { id: "2", name: "Gran Via" },
    { id: "3", name: "Diagonal" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getStaticStops as any).mockResolvedValue(mockStops);
  });

  test("load and show the selected stop", async () => {
    render(<StopsViewer />);

    const input = screen.getByPlaceholderText("Stop ID or name...");
    expect(input).toBeInTheDocument();

    // Input writting
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Gran" } });

    // Wait for stop to appear
    await waitFor(() => {
      expect(screen.getByText("Gran Via")).toBeInTheDocument();
    });

    // Select stop
    fireEvent.click(screen.getByText("Gran Via"));

    // Check stop card rendering
    await waitFor(() => {
      expect(screen.getByTestId("mock-stop-card")).toHaveTextContent(
        "Gran Via"
      );
    });
  });

  test("Show 'No stops found' if there aren't coincidences", async () => {
    render(<StopsViewer />);

    const input = screen.getByPlaceholderText("Stop ID or name...");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "Zzzz" } });

    await waitFor(() => {
      expect(screen.getByText("No stops found")).toBeInTheDocument();
    });
  });

  test("Set stop with form submit", async () => {
    render(<StopsViewer />);

    const input = screen.getByPlaceholderText("Stop ID or name...");
    fireEvent.change(input, { target: { value: "2" } });

    await waitFor(() => {
      expect(screen.getByText("Gran Via")).toBeInTheDocument();
    });

    fireEvent.submit(input.closest("form")!);

    await waitFor(() => {
      expect(screen.getByTestId("mock-stop-card")).toHaveTextContent(
        "Gran Via"
      );
    });
  });
});
