"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StopCard from "./stop-card";
import { getStaticStops } from "@/lib/utils";
import { StaticStop } from "@/lib/types";
import dynamic from "next/dynamic";
import { getTmbStopInfo } from "@/app/actions/data-fetchers/tmb";
import { getGtfsData } from "@/app/actions/data-fetchers/gtfs";

export default function StopsViewer() {
  const [stop, setStop] = useState("");
  const [stopsList, setStopsList] = useState<StaticStop[]>([]);
  const [filteredStops, setFilteredStops] = useState<StaticStop[]>([]);
  const [selectedStop, setSelectedStop] = useState("");
  const [filter, setFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [postion, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    loadStaticStops();
    getGtfsData("https://www.ambmobilitat.cat/transit/trips-updates/trips.bin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (filter === "") {
      setFilteredStops(stopsList);
    } else {
      setFilteredStops(
        stopsList.filter(
          (stop) =>
            stop.name.toLowerCase().includes(filter.toLowerCase()) ||
            stop.id.toString().includes(filter)
        )
      );
    }
  }, [filter, stopsList]);

  const loadStaticStops = async () => {
    const staticStops = await getStaticStops();
    if (staticStops) {
      setStopsList(staticStops);
      setFilteredStops([...filteredStops, ...staticStops]);
    }
  };

  const Map = useMemo(
    () =>
      dynamic(() => import("./map"), {
        ssr: false,
      }),
    []
  );

  return (
    <section className="flex flex-col gap-5 h-full">
      <Map stopName={selectedStop} position={postion} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputRef.current) setStop(inputRef.current?.value);
        }}
        className="flex gap-2 m-4 absolute w-[calc(100vw-2rem)] top-14"
      >
        <div className="flex-1">
          <input
            value={selectedStop}
            placeholder="Stop ID or name..."
            onChange={() => {
              setSelectedStop(inputRef.current?.value || "");
              if (inputRef.current) setFilter(inputRef.current.value);
            }}
            ref={inputRef}
            onFocus={() => {
              setShowDropdown(true);
            }}
            onBlur={(e) => {
              setTimeout(() => {
                if (!e.target.contains(document.activeElement)) {
                  setShowDropdown(false);
                }
              }, 200);
            }}
            className="w-full bg-white p-2 rounded-lg shadow border border-gray-300"
            type="text"
          />
          <ul
            className={`z-20 absolute w-full min-h-20 h-fit sm:max-h-80 max-h-screen overflow-auto bg-white rounded-lg shadow ${
              showDropdown ? "block" : "hidden"
            }`}
          >
            {filteredStops.length === 0 && (
              <div className="p-2">No stops found</div>
            )}
            {filteredStops.map((stop, index) => (
              <li
                key={index}
                className="p-2 flex gap-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedStop(stop.name);
                  setStop(stop.id);
                  setShowDropdown(false);
                  getTmbStopInfo(stop.id).then((data) => {
                    console.log(data);
                    if (data) {
                      setPosition({ x: data.coords[0], y: data.coords[1] });
                    }
                  });
                }}
              >
                <div>{stop.id}</div>
                {stop.name}
              </li>
            ))}
          </ul>
        </div>
      </form>
      {stop != "" && <StopCard setPosition={setPosition} stop={stop} />}
    </section>
  );
}
