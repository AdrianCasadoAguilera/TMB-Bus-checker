/* eslint-disable @typescript-eslint/no-explicit-any */
import { noBusesOnStop, stopInfo } from "@/mock/tests-mock";
import { busesOnStop } from "@/mock/tests-mock";
import { describe, expect, test, vi } from "vitest";
import { getTmbStopInfo } from "./tmb";
import { Temporal } from "@js-temporal/polyfill";

describe("get tmb stop info", () => {
  test("gets data with correct format", async () => {
    const fixedNow = Temporal.ZonedDateTime.from(
      "2025-06-23T12:00:00+02:00[Europe/Madrid]"
    );
    const fixedNowMs = Math.floor(fixedNow.epochMilliseconds);
    // Transforms the Temporal.Now.zonedDateTimeISO function to get a fixed value
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockReturnValue(fixedNow);

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve(stopInfo),
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(busesOnStop(fixedNowMs)),
      } as any);

    const result = await getTmbStopInfo("1234");

    expect(result).toStrictEqual({
      id: "1234",
      name: "Gran Via",
      coords: [2.123, 41.456],
      buses: [
        {
          line: "D50",
          destination: "Pl. Espanya",
          timesInSec: [60],
        },
      ],
    });
  });

  test("0 total features", async () => {
    const stopInfoWith0Features = { totalFeatures: 0, features: [] };

    global.fetch = vi.fn().mockResolvedValueOnce({
      json: () => Promise.resolve(stopInfoWith0Features),
    } as any);

    const result = await getTmbStopInfo("1234");

    expect(result).toBeNull();
  });

  test("buses not ok", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(stopInfo) } as any)
      .mockResolvedValueOnce({ ok: false } as any);

    const result = await getTmbStopInfo("1234");

    expect(result).toBeNull();
  });

  test("no buses on stop", async () => {
    const fixedNow = Temporal.ZonedDateTime.from(
      "2025-06-23T12:00:00+02:00[Europe/Madrid]"
    );
    const fixedNowMs = Math.floor(fixedNow.epochMilliseconds);
    // Transforms the Temporal.Now.zonedDateTimeISO function to get a fixed value
    vi.spyOn(Temporal.Now, "zonedDateTimeISO").mockReturnValue(fixedNow);
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({ json: () => Promise.resolve(stopInfo) } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(noBusesOnStop(fixedNowMs)),
      } as any);

    const result = await getTmbStopInfo("1234");

    expect(result).toBeNull();
  });
});
