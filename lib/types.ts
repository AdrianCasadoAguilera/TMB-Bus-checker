export type Stop = {
  id: string;
  name: string;
  coords: number[];
  buses: BusInfo[];
};

export type StaticStop = {
  id: string;
  name: string;
  position: string;
  operators: string[];
};

export type StaticTrip = {
  id: string;
};

export type BusInfo = {
  line: string;
  destination: string;
  timesInSec: number[];
};

export type Bus = {
  temps_arribada: number;
};
