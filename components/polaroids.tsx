"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { MiraSketch, MountainSketch } from "@/components/sketches";

type Offset = { x: number; y: number };

type Badge = {
  kicker: string;
  month: string;
  day: string;
  year: string;
  seats: string;
  href: string;
  dated: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function DraggablePhoto({
  label,
  className,
  offset,
  onOffset,
  children,
}: {
  label: string;
  className: string;
  offset: Offset;
  onOffset: (next: Offset) => void;
  children: ReactNode;
}) {
  const drag = useRef<Offset & { ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className={`polaroid ${className}${dragging ? " is-dragging" : ""}`}
      style={{ translate: `${offset.x}px ${offset.y}px` }}
      role="group"
      tabIndex={0}
      aria-label={label}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
        setDragging(true);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        onOffset({
          x: clamp(drag.current.ox + event.clientX - drag.current.x, -80, 110),
          y: clamp(drag.current.oy + event.clientY - drag.current.y, -60, 120),
        });
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragging(false);
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 24 : 12;
        const next = { ...offset };
        if (event.key === "ArrowLeft") next.x -= step;
        else if (event.key === "ArrowRight") next.x += step;
        else if (event.key === "ArrowUp") next.y -= step;
        else if (event.key === "ArrowDown") next.y += step;
        else return;
        event.preventDefault();
        onOffset({ x: clamp(next.x, -80, 110), y: clamp(next.y, -60, 120) });
      }}
    >
      {children}
    </div>
  );
}

export function PolaroidStage({
  badge,
  mountainSrc,
  mountainAlt,
  miraSrc,
  miraAlt,
  mountainCaption,
  mountainScript,
  mountainWhere,
  miraCaption,
  dragHint,
  resetLabel,
}: {
  badge: Badge;
  mountainSrc: string | null;
  mountainAlt: string;
  miraSrc: string | null;
  miraAlt: string;
  mountainCaption: string;
  mountainScript: string;
  mountainWhere: string;
  miraCaption: string;
  dragHint: string;
  resetLabel: string;
}) {
  const [mountain, setMountain] = useState<Offset>({ x: 0, y: 0 });
  const [mira, setMira] = useState<Offset>({ x: 0, y: 0 });
  const moved = mountain.x !== 0 || mountain.y !== 0 || mira.x !== 0 || mira.y !== 0;

  return (
    <div className="stage">
      <p className="script stage-hint">{dragHint}</p>
      <DraggablePhoto
        label={`${mountainCaption}. ${mountainScript}. Drag to move, or use arrow keys.`}
        className="polaroid-a"
        offset={mountain}
        onOffset={setMountain}
      >
        <span className="tape tape-yellow" aria-hidden="true" />
        <span className="frame">
          {mountainSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mountainSrc} alt={mountainAlt} />
          ) : (
            <MountainSketch />
          )}
          <span className="frame-caption">{mountainCaption}</span>
        </span>
        <span className="polaroid-script">
          {mountainScript}
          <span className="where">{mountainWhere}</span>
        </span>
      </DraggablePhoto>

      <DraggablePhoto
        label={`${miraCaption}. Drag to move, or use arrow keys.`}
        className="polaroid-b"
        offset={mira}
        onOffset={setMira}
      >
        <span className="tape tape-green" aria-hidden="true" />
        <span className="frame">
          {miraSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={miraSrc} alt={miraAlt} />
          ) : (
            <MiraSketch />
          )}
          <span className="frame-caption">{miraCaption}</span>
        </span>
      </DraggablePhoto>

      <Link className="meetup-badge" href={badge.href}>
        <span className="badge-kicker">{badge.kicker}</span>
        <span className="badge-date">
          {badge.month}
          {badge.dated ? ` ${badge.day}` : ` ${badge.year}`}
        </span>
        <span className="badge-meta">
          {badge.dated ? `${badge.year} · ` : ""}
          {badge.seats}
        </span>
      </Link>

      <svg className="spark spark-a" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z" fill="#1c2744" />
      </svg>
      <svg className="spark spark-b" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" fill="#6d8a4e" />
      </svg>

      {moved ? (
        <button
          type="button"
          className="reset-photos"
          onClick={() => {
            setMountain({ x: 0, y: 0 });
            setMira({ x: 0, y: 0 });
          }}
        >
          {resetLabel}
        </button>
      ) : null}
    </div>
  );
}
