import { TStaticStop } from "./types";

export const getStaticStops = async (): Promise<TStaticStop[] | null> => {
  const data = await fetch("/parades.csv").then((response) => response.text());
  const lines = data.split("\n");
  const stops = lines
    .filter((line, index) => index > 0 && index < lines.length - 1)
    .map((line) => line.split(","));
  const filteredStops = stops.map((stop) => {
    return { id: +stop[2], name: stop[3] };
  });
  return filteredStops;
};
