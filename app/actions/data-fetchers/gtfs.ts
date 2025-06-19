// "use server";

// import { GTFSTripUpdate, RawEntity } from "@/lib/types/gtfs";
// import { BusInfo, StaticStop } from "@/lib/types/types";
// import { parsePoint } from "@/lib/utils";
// import { Temporal } from "@js-temporal/polyfill";
// import protobuf from "protobufjs";
// import { getStaticRouteById } from "../actions";

// const protoPath = "protos/gtfs-realtime.proto";

// export const getGtfsStopInfo = async (url: string, stop: StaticStop) => {
//   const buffer = await fetch(url).then((res) => res.arrayBuffer());

//   // Load GTFS proto
//   // Official Google proto: https://github.com/MobilityData/gtfs-realtime-bindings/blob/master/gtfs-realtime.proto
//   const root = await protobuf.load(protoPath);
//   const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

//   const message = FeedMessage.decode(new Uint8Array(buffer));
//   const entities: RawEntity[] = FeedMessage.toObject(message, {
//     longs: String,
//     enums: String,
//     bytes: String,
//     defaults: true,
//   }).entity;

//   const isValidTripUpdate = (
//     e: RawEntity
//   ): e is { tripUpdate: NonNullable<RawEntity["tripUpdate"]> } =>
//     !!e.tripUpdate?.trip?.tripId;

//   const updates: GTFSTripUpdate[] = entities
//     .filter(isValidTripUpdate)
//     .map((e) => ({
//       trip: {
//         tripId: e.tripUpdate.trip!.tripId!,
//       },
//       stopTimeUpdates: (e.tripUpdate.stopTimeUpdate || []).map(
//         (s): GTFSTripUpdate["stopTimeUpdates"][number] => ({
//           stopSequence: s.stopSequence ?? -1,
//           stopId: s.stopId ?? "",
//           arrival: {
//             time: s.arrival?.time ?? 0,
//             delay: s.arrival?.delay ?? 0,
//           },
//           departure: {
//             time: s.departure?.time ?? 0,
//             delay: s.departure?.delay ?? 0,
//           },
//         })
//       ),
//     }));

//   // Get the actual timestamp in Barcelona
//   const timeZone = "Europe/Madrid";
//   const now = Temporal.Now.zonedDateTimeISO(timeZone);
//   const nowTimestamp = Math.floor(now.epochMilliseconds / 1000); // Seconds

//   console.log({
//     nowTimestamp,
//     nowUTC: new Date(nowTimestamp * 1000).toUTCString(),
//     nowMadrid: new Date(nowTimestamp * 1000).toLocaleString("es-ES", {
//       timeZone: "Europe/Madrid",
//     }),
//     serverTime: new Date().toString(),
//   });

//   console.log(stop.position);

//   const stopProperties = {
//     id: stop.id,
//     name: stop.name,
//     coords: parsePoint(stop.position),
//     buses: [],
//   };

//   const groupedByLine: Record<string, { time: number; delay: number }[]> = {};

//   updates.forEach((update) => {
//     const matchingStopTimes = update.stopTimeUpdates.filter((stu) => {
//       return +stu.stopId === +stop.id;
//     });

//     matchingStopTimes.forEach((matchingStopTime) => {
//       console.log(matchingStopTime);

//       const delay = matchingStopTime.arrival.delay;
//       const arrival = +matchingStopTime.arrival.time;
//       const secondsUntilArrival = arrival - nowTimestamp;

//       const tripId = update.trip.tripId;
//       const line = tripId.split(".")[0];
//       const delayInSeconds = delay;

//       if (!groupedByLine[line]) {
//         groupedByLine[line] = [];
//       }

//       groupedByLine[line].push({
//         time: secondsUntilArrival,
//         delay: delayInSeconds,
//       });
//     });
//   });

//   const buses: BusInfo[] = await Promise.all(
//     Object.entries(groupedByLine).map(async ([line, arrivals]) => {
//       const routeData = await getStaticRouteById(line);
//       return {
//         line: routeData.line,
//         destination: routeData.destination,
//         timesInSec: arrivals.sort((a, b) => a.time - b.time).map((a) => a.time),
//         delays: arrivals.sort((a, b) => a.time - b.time).map((a) => a.delay),
//       };
//     })
//   );

//   stopProperties.buses = buses;

//   return stopProperties;
// };
