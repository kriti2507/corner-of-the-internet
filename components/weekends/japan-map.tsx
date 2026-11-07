"use client";

import { useMemo } from "react";
import rings from "@/data/japan-rings.json";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  color: string;
};

const WIDTH = 420;
const HEIGHT = 460;
/** Hokkaido down to Kyushu. Okinawa gets its own inset box. */
const MAIN = { minLng: 128.6, maxLng: 146.2, minLat: 30.9, maxLat: 45.8, x: 0, y: 0, w: WIDTH, h: HEIGHT };
const INSET = { minLng: 126.55, maxLng: 128.45, minLat: 25.95, maxLat: 27.05, x: 268, y: 352, w: 140, h: 88 };

type Frame = typeof MAIN;

function inFrame(frame: Frame, lat: number, lng: number) {
  return lat >= frame.minLat && lat <= frame.maxLat && lng >= frame.minLng && lng <= frame.maxLng;
}

function project(frame: Frame, lng: number, lat: number) {
  return {
    x: frame.x + ((lng - frame.minLng) / (frame.maxLng - frame.minLng)) * frame.w,
    y: frame.y + ((frame.maxLat - lat) / (frame.maxLat - frame.minLat)) * frame.h,
  };
}

function outline(frame: Frame) {
  return (rings as number[][][])
    .map(
      (ring) =>
        ring
          .map((point, index) => {
            const { x, y } = project(frame, point[0], point[1]);
            return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(" ") + " Z",
    )
    .join(" ");
}

export function JapanMap({
  points,
  activeId,
  onSelect,
  label,
  caption,
}: {
  points: MapPoint[];
  activeId: string | null;
  onSelect: (id: string) => void;
  label: string;
  caption?: string;
}) {
  const mainPath = useMemo(() => outline(MAIN), []);
  const insetPath = useMemo(() => outline(INSET), []);
  const placed = useMemo(
    () =>
      points
        .map((point) => {
          const frame = inFrame(MAIN, point.lat, point.lng) ? MAIN : inFrame(INSET, point.lat, point.lng) ? INSET : null;
          return frame ? { ...point, ...project(frame, point.lng, point.lat) } : null;
        })
        .filter((point) => point !== null)
        // draw the active pin last so it sits on top
        .sort((a, b) => Number(a.id === activeId) - Number(b.id === activeId)),
    [points, activeId],
  );
  const hasOkinawa = points.some((point) => inFrame(INSET, point.lat, point.lng));

  return (
    <figure className="wk-card wk-map">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label={label}>
        <defs>
          <clipPath id="wk-main-clip">
            <rect width={WIDTH} height={HEIGHT} />
          </clipPath>
          <clipPath id="wk-inset-clip">
            <rect x={INSET.x} y={INSET.y} width={INSET.w} height={INSET.h} rx="6" />
          </clipPath>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill="#dde7ee" />
        <path d={mainPath} clipPath="url(#wk-main-clip)" fill="#f8f4ea" stroke="#1c2744" strokeWidth="1" strokeLinejoin="round" />
        {hasOkinawa ? (
          <g>
            <rect x={INSET.x} y={INSET.y} width={INSET.w} height={INSET.h} rx="6" fill="#dde7ee" stroke="#1c2744" strokeWidth="1" />
            <path d={insetPath} clipPath="url(#wk-inset-clip)" fill="#f8f4ea" stroke="#1c2744" strokeWidth="1" strokeLinejoin="round" />
            <text x={INSET.x + 7} y={INSET.y + 14} fontSize="10" fontWeight="700" fill="#3d4a66">
              Okinawa
            </text>
          </g>
        ) : null}
        {placed.map((point) => {
          const active = point.id === activeId;
          return (
            <g
              key={point.id}
              className="wk-pin"
              transform={`translate(${point.x.toFixed(1)} ${point.y.toFixed(1)})`}
              role="button"
              tabIndex={0}
              aria-label={point.label}
              aria-pressed={active}
              onClick={() => onSelect(point.id)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                onSelect(point.id);
              }}
            >
              <circle r="11" fill="transparent" />
              {active ? <circle r="11" fill={point.color} opacity="0.22" /> : null}
              <circle r={active ? 6.5 : 4.6} fill={point.color} stroke="#1c2744" strokeWidth={active ? 2 : 1.2} />
            </g>
          );
        })}
      </svg>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
