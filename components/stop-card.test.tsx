import { describe, expect, test, vi, beforeEach } from "vitest";
import StopCard from "./stop-card";
import { render, waitFor, screen } from "@testing-library/react";
import { getTmbStopInfo } from "@/app/actions/data-fetchers/tmb";

vi.mock("@/app/actions/data-fetchers/tmb", () => ({
  getTmbStopInfo: vi.fn(),
}));

describe("StopCard", () => {
  // getTmbStopInfo as a mocked function (to be able to call mockResolvedValue)
  const mockedGetTmbStopInfo = getTmbStopInfo as ReturnType<typeof vi.fn>;

  // Clean mock data before each test and initialise fake timers
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("show stop and buses correctly", async () => {
    mockedGetTmbStopInfo.mockResolvedValue({
      name: "Gran Via",
      coords: [2.17, 41.38],
      buses: [
        {
          line: "H12",
          destination: "Besòs",
          timesInSec: [120, 300],
        },
      ],
    });

    render(
      <StopCard
        stop={{
          id: "1234",
          name: "Gran Via",
          position: "POINT (41.38 2.17)",
          operators: ["TMB"],
        }}
        setPosition={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Gran Via")).toBeInTheDocument();
      expect(screen.getByText("H12")).toBeInTheDocument();
      expect(screen.getByText("Besòs")).toBeInTheDocument();
      expect(screen.getByText("2min")).toBeInTheDocument();
    });
  });

  test("show error message if the stop fails", async () => {
    mockedGetTmbStopInfo.mockResolvedValue(null);

    render(
      <StopCard
        stop={{
          id: "fail",
          name: "fail",
          position: "",
          operators: [],
        }}
        setPosition={() => {}}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("We could not find the stop :(")
      ).toBeInTheDocument();
    });
  });
});
