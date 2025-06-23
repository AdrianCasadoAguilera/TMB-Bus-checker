/* eslint-disable @typescript-eslint/no-explicit-any */
import { mockCsv } from "@/mock/tests-mock";
import { describe, expect, test, vi } from "vitest";
import { getStaticStops } from "./actions";

describe("get static data", () => {
  test("gets correct data", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockCsv),
    }) as any;

    const result = await getStaticStops();

    expect(result).toStrictEqual([
      {
        id: "1234",
        name: "Parada Gran Via",
        position: "POINT (2.1234 41.4036)",
        operators: ["TMB"],
      },
      {
        id: "5678",
        name: "Parada Diagonal",
        position: "POINT (2.1500 41.4123)",
        operators: ["TMB"],
      },
    ]);
  });

  test("returns null when error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error")) as any;

    const result = await getStaticStops();

    expect(result).toBeNull();
  });

  test("returns empty array when CSV malformation", async () => {
    const emptyCsv = "wrong,data,only,four,columns\n1,2,3";

    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(emptyCsv),
    });

    const result = await getStaticStops();

    expect(result).toStrictEqual([]);
  });
});
