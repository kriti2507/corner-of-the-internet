"use client";

import { useState, type CSSProperties } from "react";
import {
  MAX_STARTERS,
  PALETTES,
  PREVIEW_DAYS,
  STARTERS,
  previewShades,
} from "@/lib/small-wins-starters";

/**
 * A working copy of the Small Wins first screen: pick up to three sticky
 * notes and the sample time capsule fills in beside them. Nothing is saved.
 */
export function StarterDemo({
  initial = ["Workout", "Reading"],
  compact = false,
}: {
  initial?: string[];
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<string[]>(initial);
  const full = selected.length >= MAX_STARTERS;
  const picked = STARTERS.filter((s) => selected.includes(s.name));

  function toggle(name: string) {
    setSelected((now) =>
      now.includes(name)
        ? now.filter((n) => n !== name)
        : now.length >= MAX_STARTERS
          ? now
          : [...now, name],
    );
  }

  const count =
    selected.length === 0
      ? "Nothing picked yet"
      : full
        ? `${MAX_STARTERS} of ${MAX_STARTERS}, nice picks!`
        : `${selected.length} of ${MAX_STARTERS} picked`;

  return (
    <div className={compact ? "sd sd-compact" : "sd"}>
      <div className="sd-head">
        <p className="sd-title">What do you want to track?</p>
        <p className="sd-hint">Pick up to 3 to start. Try it.</p>
      </div>
      <div className="sd-notes" role="group" aria-label="Starter aspects">
        {STARTERS.map((s) => {
          const on = selected.includes(s.name);
          const ramp = PALETTES[s.color];
          return (
            <button
              key={s.name}
              type="button"
              className={on ? "sd-note is-on" : "sd-note"}
              style={{ "--note-tint": ramp[0], "--note-ink": ramp[4] } as CSSProperties}
              aria-pressed={on}
              disabled={full && !on}
              onClick={() => toggle(s.name)}
            >
              {on ? <span className="sd-circle" aria-hidden="true" /> : null}
              <span className="sd-name">{s.name}</span>
              {compact ? null : <span className="sd-note-hint">{s.hint}</span>}
              <span className="sd-icon" aria-hidden="true">
                {s.icon}
              </span>
            </button>
          );
        })}
      </div>
      <div className="sd-preview" aria-hidden="true">
        <p className="sd-preview-title">Your time capsule will look like…</p>
        {picked.map((s) => (
          <div key={s.name} className="sd-lane">
            <div className="sd-lane-name">
              {s.icon} {s.name}
              {s.measure ? <span className="sd-measure"> · {s.measure}</span> : null}
            </div>
            <div className="sd-boxes">
              {previewShades(s.name).map((shade, i) => (
                <i key={i} style={shade < 0 ? undefined : { background: PALETTES[s.color][shade] }} />
              ))}
            </div>
          </div>
        ))}
        {!full ? (
          <div className="sd-lane is-open">
            <div className="sd-lane-name">
              {selected.length === 0 ? "Pick a note to see it here" : "+ one more?"}
            </div>
            <div className="sd-boxes">
              {Array.from({ length: PREVIEW_DAYS }, (_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <p className="sd-count" aria-live="polite">
        {count}
      </p>
    </div>
  );
}
