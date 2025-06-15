"use server";

import fs from "fs/promises";
import path from "path";
import { StaticStop } from "./types";

export const getStaticStops = async (): Promise<StaticStop[] | null> => {
  const tmbPath = path.join(process.cwd(), "data/static-gtfs/tmb-stops.csv");
  const ambPath = path.join(process.cwd(), "data/static-gtfs/amb-stops.csv");

  try {
    const tmbData = await fs.readFile(tmbPath, "utf-8");
    const tmbLines = tmbData.split("\n");

    const tmbStops = tmbLines
      .filter((line, index) => index > 0 && index < tmbLines.length - 1)
      .map((line) => line.split(","));

    let filteredStops: StaticStop[] = tmbStops.map((stop) => ({
      id: stop[2],
      name: stop[3],
      position: stop[20],
    }));

    const ambData = await fs.readFile(ambPath, "utf-8");
    const ambLines = ambData.split("\n");

    const ambStops = ambLines
      .filter((line, i) => i > 0 && i < ambLines.length - 1)
      .map((line) => line.split(","));

    const stopIds = filteredStops.map((filteredStop) => filteredStop.id);

    filteredStops = [
      ...filteredStops,
      ...ambStops
        .filter((stop) => !stopIds.includes(stop[2]))
        .map((stop) => ({
          id: stop[1],
          name: stop[2],
          position: `POINT (${stop[4]} ${stop[5]})`,
        })),
    ];

    return filteredStops;
  } catch (error) {
    console.error("Error llegint l'arxiu CSV:", error);
    return null;
  }
};
