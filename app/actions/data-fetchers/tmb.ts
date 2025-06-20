"use server";

import { Bus, BusInfo, Stop } from "@/lib/types/types";
import { Temporal } from "@js-temporal/polyfill";

export const getTmbStopInfo = async (stop: string): Promise<Stop | null> => {
  const stopInfo = await fetch(
    `https://api.tmb.cat/v1/transit/parades/${stop}/?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}`
  );

  const jsonStopInfo = await stopInfo.json();

  if (jsonStopInfo.totalFeatures == 0) {
    return null;
  }

  const buses = await fetch(
    `https://api.tmb.cat/v1/itransit/bus/parades/${stop}?app_id=${process.env.API_ID}&app_key=${process.env.API_KEY}`
  );
  if (buses.ok) {
    const busesData = await buses.json();

    const timeZone = "Europe/Madrid";
    const now = Temporal.Now.zonedDateTimeISO(timeZone);
    const nowTimestamp = Math.floor(now.epochMilliseconds); // Milliseconds
    const parada = busesData.parades.find(
      (parada: { codi_parada: string }) => +parada.codi_parada === +stop
    );
    if (!parada) return null;
    const transformedData: BusInfo[] = parada.linies_trajectes.map(
      (line: {
        propers_busos: Bus[];
        nom_linia: string;
        desti_trajecte: string;
      }) => ({
        line: line.nom_linia,
        destination: line.desti_trajecte,
        timesInSec: line.propers_busos.map((bus: { temps_arribada: number }) =>
          Math.trunc((bus.temps_arribada - nowTimestamp) / 1000)
        ),
      })
    );

    const stopProperties = jsonStopInfo.features[0].properties;
    return {
      id: stop,
      name: stopProperties.NOM_PARADA,
      coords: jsonStopInfo.features[0].geometry.coordinates,
      buses: transformedData,
    };
  }
  return null;
};
