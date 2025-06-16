"use server";

// import { Temporal } from "@js-temporal/polyfill";
import protobuf from "protobufjs";

const protoPath = "protos/gtfs-realtime.proto";

export const getGtfsData = async (url: string) => {
  const buffer = await fetch(url).then((res) => res.arrayBuffer());

  // Load GTFS proto
  // Official Google proto: https://github.com/MobilityData/gtfs-realtime-bindings/blob/master/gtfs-realtime.proto
  const root = await protobuf.load(protoPath);
  const FeedMessage = root.lookupType("transit_realtime.FeedMessage");

  const message = FeedMessage.decode(new Uint8Array(buffer));
  const object = FeedMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
    defaults: true,
  });

  // Get the actual and +24h timestamp in Barcelona
  // const timeZone = "Europe/Madrid";
  // const now = Temporal.Now.zonedDateTimeISO(timeZone);
  // const nowTimestamp = Math.floor(now.epochMilliseconds / 1000);
  // const in24hTimestamp = Math.floor(
  //   now.add(Temporal.Duration.from({ days: 1 })).epochMilliseconds / 1000
  // );

  return object.entity;
};
