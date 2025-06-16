import { StaticStop } from "./types";

export const getStaticStopByName = async (
  stops: StaticStop[],
  stopName: string
) => {
  stops.find((stop) => stop.name === stopName);
};
