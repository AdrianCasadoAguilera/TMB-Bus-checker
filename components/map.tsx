"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup } from "react-leaflet";
import { TileLayer } from "react-leaflet";

type MapProps = {
  position: { x: number; y: number } | null;
  stopName: string;
};

export default function Map({ position, stopName }: MapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div id="map" className="left-0 z-0 h-full w-full">
      <MapContainer
        key={position ? `${position.x}-${position.y}` : "default"}
        center={[position ? position.x : 41.387, position ? position.y : 2.17]}
        zoom={17}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={[position.x, position.y]}>
            <Popup>
              <b>{stopName}</b>
              <br />
              <a
                target="_blank"
                href={`https://www.google.com/maps?q=${position.x},${position.y}`}
              >
                Google Maps
              </a>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
