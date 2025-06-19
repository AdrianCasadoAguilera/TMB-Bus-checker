"use client";

import { getTmbStopInfo } from "@/app/actions/data-fetchers/tmb";
import { BusInfo, StaticStop, Stop } from "@/lib/types/types";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
// import { getGtfsStopInfo } from "@/app/actions/data-fetchers/gtfs";

type StopCardProps = {
  stop: StaticStop;
  setPosition: (value: { x: number; y: number }) => void;
};

export default function StopCard({ stop, setPosition }: StopCardProps) {
  const [exists, setExists] = useState(true);
  const [buses, setBuses] = useState<BusInfo[]>([]);
  const [stopName, seStopName] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchBuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, stop]);

  const fetchBuses = async () => {
    setExists(true);
    startTransition(async () => {
      const tmbStop = await getTmbStopInfo(stop.id);

      if (tmbStop !== null) {
        setExists(true);
        const stopInfo: Stop = tmbStop;
        setLastUpdate(0);
        setBuses(stopInfo.buses);
        seStopName(stopInfo.name);
        console.log({ x: stopInfo.coords[1], y: stopInfo.coords[0] });
        setPosition({ x: stopInfo.coords[1], y: stopInfo.coords[0] });
      } else {
        console.log("Error en la respuesta: ", tmbStop);
        setExists(false);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      intervalRef.current = setInterval(() => {
        setLastUpdate((prev) => prev + 1);
      }, 1000);
    });
  };

  return (
    <section className="z-10 sm:w-96 w-[calc(100vw-2rem)] h-80 p-4 rounded-xl border bg-white border-gray-300 shadow m-4 absolute top-28">
      {exists ? (
        <div className="flex flex-col">
          <div className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <p className="min-w-10 h-10 flex items-center justify-center text-white rounded-full bg-red-500">
                {stop.id}
              </p>
              <p className="font-semibold">
                {isPending ? "Loading..." : stopName}
              </p>
            </div>
            <div className="mr-2 flex gap-2 items-center">
              <button onClick={fetchBuses} className="cursor-pointer">
                <ArrowPathIcon
                  className={`${isPending && " animate-spin"} h-5`}
                />
              </button>
            </div>
          </div>
          <div className="h-[1px] w-full bg-slate-300" />
          <div className="h-52 overflow-auto flex flex-col">
            {isPending ? (
              <p>Loading...</p>
            ) : (
              buses.map((bus, index) => (
                <div
                  key={index}
                  className={`flex justify-between p-1 ${
                    index % 2 === 0 && "bg-gray-100"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <p
                      className={`${
                        bus.line[0] === "H"
                          ? "bg-blue-800"
                          : bus.line[0] == "V"
                          ? "bg-green-500"
                          : ["X1", "X2", "X3"].includes(bus.line)
                          ? "bg-black"
                          : bus.line[0] == "D"
                          ? "bg-purple-700"
                          : bus.line[0] === "N"
                          ? "bg-blue-500"
                          : bus.line[0] === "L" ||
                            bus.line[0] === "X" ||
                            ["86"].includes(bus.line)
                          ? "bg-amber-400"
                          : "bg-red-500"
                      } text-white flex items-center justify-center w-10 rounded-lg`}
                    >
                      {bus.line}
                    </p>
                    <p className="text-sm text-slate-500">{bus.destination}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    {bus.timesInSec.map((timeInSec, i) => {
                      const time =
                        timeInSec > 3600
                          ? Math.trunc(timeInSec / 3600) + "h"
                          : timeInSec > 60
                          ? Math.trunc(timeInSec / 60) + "min"
                          : timeInSec + "s";
                      return (
                        <p
                          key={i}
                          className={i !== 0 ? "text-neutral-400" : ""}
                        >
                          {time}
                        </p>
                      );
                    })}
                    {/* {bus.timesInSec[0] < 60
                    ? bus.timesInSec[0] + "s"
                    : Math.trunc(bus.timesInSec[0] / 60) + "min"} */}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="h-[0.5px] w-full bg-slate-300" />
          <div className="py-2">
            <p className="text-sm text-slate-500">
              Last update:{" "}
              {lastUpdate < 60
                ? ` ${lastUpdate}s `
                : `${Math.trunc(lastUpdate / 60)}min `}
              ago
            </p>
          </div>
        </div>
      ) : (
        <p>We could not find the stop :(</p>
      )}
    </section>
  );
}
