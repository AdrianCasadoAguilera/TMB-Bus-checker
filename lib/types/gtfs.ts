export type GTFSTripUpdate = {
  trip: GTGSTrip;
  stopTimeUpdates: GTFSStopTimeUpdate[];
};

export type GTGSTrip = {
  tripId: string;
};

export type GTFSStopTimeUpdate = {
  stopSequence: number;
  stopId: string;
  arrival: {
    time: number;
    delay: number;
  };
  departure: {
    time: number;
    delay: number;
  };
};

export type RawEntity = {
  tripUpdate?: {
    trip?: {
      tripId?: string;
    };
    stopTimeUpdate?: {
      stopSequence?: number;
      stopId?: string;
      arrival?: {
        time?: number;
        delay?: number;
      };
      departure?: {
        time?: number;
        delay?: number;
      };
    }[];
  };
};
