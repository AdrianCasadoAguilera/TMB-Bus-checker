"use client";

import { getStopInfo } from "@/lib/actions";
import { TBusInfo, TStop } from "@/lib/types";
import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type StopCardProps = {
  stop: number;
  setPosition: (value: { x: number; y: number }) => void;
};

export default function StopCard({ stop, setPosition }: StopCardProps) {
  const [exists, setExists] = useState(true);
  const [buses, setBuses] = useState<TBusInfo[]>([]);
  const [stopName, setStopName] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchBuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [, stop]);

  const fetchBuses = async () => {
    startTransition(async () => {
      const response = await getStopInfo(stop);
      if (response != null) {
        setExists(true);
        const stopInfo: TStop = response;
        setLastUpdate(0);
        setBuses(stopInfo.buses);
        setStopName(stopInfo.name);
        setPosition({ x: stopInfo.coords[1], y: stopInfo.coords[0] });
      } else {
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
    <section className="z-10 w-80 sm:min-h-80 h-fit p-4 rounded-xl border bg-white border-gray-300 shadow m-4 absolute top-28">
      {exists ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className="w-10 h-10 flex items-center justify-center text-white rounded-full bg-red-500">
                {stop}
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
          {isPending ? (
            <p>Loading...</p>
          ) : (
            buses.map((bus, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <p
                    className={`${
                      bus.line[0] === "H"
                        ? "bg-blue-800"
                        : bus.line[0] == "V"
                        ? "bg-green-500"
                        : bus.line[0] == "X"
                        ? "bg-black"
                        : bus.line[0] == "D"
                        ? "bg-purple-700"
                        : "bg-red-500"
                    } text-white flex items-center justify-center w-10 rounded-lg`}
                  >
                    {bus.line}
                  </p>
                  <p className="text-sm text-slate-500">{bus.destination}</p>
                </div>
                <p>
                  {bus.timeInMin < 1
                    ? bus.timeInSec + "s"
                    : bus.timeInMin + "min"}
                </p>
              </div>
            ))
          )}
          <div className="h-[0.5px] w-full bg-slate-300" />
          <div>
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
