"use server";

import { TBusInfo, TStop } from "./types";

export const getStopInfo = async (stop: number): Promise<TStop | null> => {
  const stopInfo = await fetch(
    `https://api.tmb.cat/v1/transit/parades/${stop}/?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}`
  );

  const jsonStopInfo = await stopInfo.json();

  if (jsonStopInfo.totalFeatures == 0) {
    return null;
  }

  const buses = await fetch(
    `https://api.tmb.cat/v1/ibus/stops/${stop}?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}`
  );
  if (buses.ok) {
    const busesData = await buses.json();
    const transformedData: TBusInfo[] = busesData.data.ibus.map((bus) => ({
      line: bus.line,
      destination: bus.destination,
      timeInSec: bus["t-in-s"],
      timeInMin: bus["t-in-min"],
    }));

    const stopProperties = jsonStopInfo.features[0].properties;
    return {
      id: stop,
      name: stopProperties.NOM_PARADA,
      coords: [],
      buses: transformedData,
    };
  }
  return null;
};
