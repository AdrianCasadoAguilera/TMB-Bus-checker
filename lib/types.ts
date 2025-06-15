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
};

export type StaticTrip = {
  id: string;
};

export type BusInfo = {
  line: string;
  destination: string;
  timeInSec: number;
  timeInMin: number;
};

export type Bus = {
  temps_arribada: number;
};
