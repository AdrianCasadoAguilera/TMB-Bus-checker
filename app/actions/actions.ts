"use server";

import fs from "fs/promises";
import path from "path";
import { StaticStop } from "@/lib/types";

export const getStaticStops = async (): Promise<StaticStop[] | null> => {
  const tmbPath = path.join(process.cwd(), "data/static-gtfs/tmb-stops.csv");
  const ambPath = path.join(process.cwd(), "data/static-gtfs/amb-stops.csv");

  try {
    const tmbData = await fs.readFile(tmbPath, "utf-8");
    const tmbLines = tmbData.split("\n");

    const tmbStops = tmbLines
      .filter((line, index) => index > 0 && index < tmbLines.length - 1)
      .map((line) => line.split(","));

    const stopMap: Record<string, StaticStop> = {};

    for (const stop of tmbStops) {
      const id = stop[2];
      stopMap[id] = {
        id,
        name: stop[3],
        position: stop[20],
        operators: ["TMB"],
      };
    }

    const ambData = await fs.readFile(ambPath, "utf-8");
    const ambLines = ambData.split("\n");

    const ambStops = ambLines
      .filter((line, i) => i > 0 && i < ambLines.length - 1)
      .map((line) => line.split(","));

    for (const stop of ambStops) {
      const id = stop[1];
      const name = stop[2];
      const position = `POINT (${stop[4]} ${stop[5]})`;

      if (stopMap[id]) {
        if (!stopMap[id].operators.includes("AMB")) {
          stopMap[id].operators.push("AMB");
        }
      } else {
        stopMap[id] = {
          id,
          name,
          position,
          operators: ["AMB"],
        };
      }
    }

    return Object.values(stopMap);
  } catch (error) {
    console.error("Error llegint l'arxiu CSV:", error);
    return null;
  }
};
