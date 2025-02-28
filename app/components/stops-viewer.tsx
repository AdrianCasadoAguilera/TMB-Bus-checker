"use client";

import { useEffect, useRef, useState } from "react";
import StopCard from "./stop-card";
import { getStaticStops } from "@/lib/utils";
import { TStaticStop } from "@/lib/types";
import Select from "react-select";

export default function StopsViewer() {
  const [stop, setStop] = useState(0);
  const [stopsList, setStopsList] = useState<TStaticStop[]>([]);
  const [selectedStop, setSelectedStop] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadStaticStops();
  }, []);

  const loadStaticStops = async () => {
    const staticStops = await getStaticStops();
    console.log(staticStops);
    if (staticStops) {
      setStopsList(staticStops);
    } else {
      console.log("Null static stops");
    }
  };

  return (
    <section className="flex flex-col gap-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputRef.current) setStop(+inputRef.current?.value);
        }}
        className="flex gap-2"
      >
        <input
          ref={inputRef}
          placeholder="Stop ID..."
          className="bg-white w-40 p-2 rounded-lg shadow border border-gray-300"
          type="number"
        />
        <Select
          className="w-full"
          options={stopsList.map((stop) => {
            return { value: stop.id, label: stop.name };
          })}
          value={selectedStop}
          inputValue=""
          onInputChange={(newValue) => {
            setSelectedStop(newValue);
          }}
          onChange={(newValue) => {
            setStop(newValue!.value);
          }}
          placeholder=""
        />
        <button
          onClick={() => {
            if (inputRef.current) setStop(+inputRef.current?.value);
          }}
          className="bg-red-500 text-white py-2 px-4 border border-red-500 hover:bg-transparent transition-all hover:text-red-500 rounded-lg cursor-pointer"
        >
          Consultar
        </button>
      </form>
      <div className="flex">
        {stop > 0 ? <StopCard stop={stop} /> : <p>Start by searching a stop</p>}
      </div>
    </section>
  );
}
