export type TStop = {
  id: number;
  name: string;
  coords: number[];
  buses: TBusInfo[];
};

export type TStaticStop = {
  id: number;
  name: string;
  position: string;
};

export type TBusInfo = {
  line: string;
  destination: string;
  timeInSec: number;
  timeInMin: number;
};

export type IBus = {
  line: string;
  destination: string;
  "t-in-s": number;
  "t-in-min": number;
};
