import { StaticStop } from "./types/types";

export const getStaticStopByName = async (
  stops: StaticStop[],
  stopName: string
) => {
  stops.find((stop) => stop.name === stopName);
};

export function parsePoint(pointStr: string) {
  const coords = pointStr
    .replace("POINT (", "")
    .replace(")", "")
    .split(" ")
    .map(Number)
    .reverse();

  return coords;
}
