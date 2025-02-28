export type TStop = {
  id: number;
  name: string;
  coords: number[];
  buses: TBusInfo[];
};

export type TStaticStop = {
  id: number;
  name: string;
};

export type TBusInfo = {
  line: string;
  destination: string;
  timeInSec: number;
  timeInMin: number;
};
