"use client";

import { useEffect, useRef, useState } from "react";
import StopCard from "./stop-card";
import { getStaticStops } from "@/lib/utils";
import { TStaticStop } from "@/lib/types";
import dynamic from "next/dynamic";

export default function StopsViewer() {
  const [stop, setStop] = useState(0);
  const [stopsList, setStopsList] = useState<TStaticStop[]>([]);
  const [filteredStops, setFilteredStops] = useState<TStaticStop[]>([]);
  const [selectedStop, setSelectedStop] = useState("");
  const [filter, setFilter] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [postion, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    loadStaticStops();
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
      setFilteredStops(staticStops);
    }
  };

  const Map = dynamic(() => import("./test-map"), {
    ssr: false,
  });

  return (
    <section className="flex flex-col gap-5">
      <Map stopName={selectedStop} position={postion} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputRef.current) setStop(+inputRef.current?.value);
        }}
        className="flex gap-2"
      >
        <div className="relative w-full">
          <input
            value={selectedStop}
            placeholder="Stop ID or name..."
            onChange={() => {
              setSelectedStop(inputRef.current?.value || "");
              if (inputRef.current) setFilter(inputRef.current.value);
            }}
            ref={inputRef}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
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
                }}
              >
                <div>{stop.id}</div>
                {stop.name}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => {
            if (inputRef.current) setStop(+inputRef.current?.value);
          }}
          className="z-10 bg-red-500 text-white py-2 px-4 border-2 border-red-500 hover:bg-white transition-all hover:text-red-500 rounded-lg cursor-pointer"
        >
          Consultar
        </button>
      </form>
      <div className="w-full flex sm:justify-between justify-center">
        {stop > 0 && <StopCard setPosition={setPosition} stop={stop} />}
      </div>
    </section>
  );
}
