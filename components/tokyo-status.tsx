"use client";

import { useEffect, useState } from "react";
import { tokyoClock, type TokyoWeather } from "@/lib/tokyo";

export function TokyoStatus({ weather }: { weather: TokyoWeather | null }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTime(tokyoClock());
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <p className="tokyo-status">
      <span className="sr-only">Tokyo time</span>
      <time dateTime={time ?? undefined}>{time ?? "––:––"}</time>
      {weather ? (
        <span className="tokyo-weather">
          <span aria-hidden="true"> · </span>
          {weather.temp}° {weather.label}
        </span>
      ) : null}
    </p>
  );
}
