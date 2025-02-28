"use client";

import { getStopInfo } from "@/lib/actions";
import { TBusInfo, TStop } from "@/lib/types";
import { useEffect, useRef, useState, useTransition } from "react";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type StopCardProps = {
  stop: number;
};

export default function StopCard({ stop }: StopCardProps) {
  const [exists, setExists] = useState(true);
  const [buses, setBuses] = useState<TBusInfo[]>([]);
  const [stopName, setStopName] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchBuses();
  }, [, stop]);

  const fetchBuses = async () => {
    startTransition(async () => {
      const response = await getStopInfo(stop);
      if (response != null) {
        console.log("Entra");
        setExists(true);
        const stopInfo: TStop = response;
        setLastUpdate(0);
        setBuses(stopInfo.buses);
        setStopName(stopInfo.name);
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
    <section className="w-80 min-h-80 h-fit p-4 rounded-xl border bg-white border-gray-300 shadow select-none">
      {exists ? (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <p className=" w-fit p-2 text-white rounded-full bg-red-500">
                {stop}
              </p>
              <p className="font-semibold">
                {isPending ? "Loading..." : stopName}
              </p>
            </div>
            <div className="mr-2">
              <button onClick={fetchBuses} className="cursor-pointer">
                <FontAwesomeIcon
                  icon={faRotateRight}
                  className={`${isPending && " animate-spin"}`}
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
