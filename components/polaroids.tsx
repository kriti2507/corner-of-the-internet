"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode, type Ref } from "react";
import { MiraSketch, MountainSketch } from "@/components/sketches";

type Secret = {
  title: string;
  body: string;
  cta?: { label: string; href: string };
};

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

function revealed(offset: Offset) {
  return Math.hypot(offset.x, offset.y) >= 42;
}

function SecretCard({
  secret,
  foundLabel,
  open,
  className,
}: {
  secret: Secret;
  foundLabel: string;
  open: boolean;
  className: string;
}) {
  const cta = secret.cta;
  const external = cta?.href.startsWith("http");
  // A ?perk= link reloads the page so the contact form can read it and pre-fill.
  const plain = !external && cta?.href.includes("?");
  return (
    <article
      className={`secret-perk ${className}${open ? " is-found" : ""}`}
      aria-hidden={open ? undefined : true}
      inert={open ? undefined : true}
    >
      <p className="script secret-found">{foundLabel}</p>
      <p className="secret-title">{secret.title}</p>
      <p>{secret.body}</p>
      {cta ? (
        external ? (
          <a className="card-link" href={cta.href} target="_blank" rel="noreferrer" tabIndex={open ? undefined : -1}>
            {cta.label}
          </a>
        ) : plain ? (
          <a className="card-link" href={cta.href} tabIndex={open ? undefined : -1}>
            {cta.label}
          </a>
        ) : (
          <Link className="card-link" href={cta.href} tabIndex={open ? undefined : -1}>
            {cta.label}
          </Link>
        )
      ) : null}
    </article>
  );
}

const DRAG_X = { min: -170, max: 190 };
const DRAG_Y = { min: -120, max: 160 };

function DraggablePhoto({
  label,
  className,
  offset,
  onOffset,
  photoRef,
  children,
}: {
  label: string;
  className: string;
  offset: Offset;
  onOffset: (next: Offset) => void;
  photoRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  const drag = useRef<Offset & { ox: number; oy: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  function stopDrag() {
    drag.current = null;
    setDragging(false);
  }

  return (
    <div
      ref={photoRef}
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
          x: clamp(drag.current.ox + event.clientX - drag.current.x, DRAG_X.min, DRAG_X.max),
          y: clamp(drag.current.oy + event.clientY - drag.current.y, DRAG_Y.min, DRAG_Y.max),
        });
      }}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onOffset({ x: 0, y: 0 });
          return;
        }
        const step = event.shiftKey ? 48 : 28;
        const next = { ...offset };
        if (event.key === "ArrowLeft") next.x -= step;
        else if (event.key === "ArrowRight") next.x += step;
        else if (event.key === "ArrowUp") next.y -= step;
        else if (event.key === "ArrowDown") next.y += step;
        else return;
        event.preventDefault();
        onOffset({
          x: clamp(next.x, DRAG_X.min, DRAG_X.max),
          y: clamp(next.y, DRAG_Y.min, DRAG_Y.max),
        });
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
  secrets,
  secretFound,
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
  secrets: readonly Secret[];
  secretFound: string;
}) {
  const [mountain, setMountain] = useState<Offset>({ x: 0, y: 0 });
  const [mira, setMira] = useState<Offset>({ x: 0, y: 0 });
  const firstPhoto = useRef<HTMLDivElement>(null);
  const moved = mountain.x !== 0 || mountain.y !== 0 || mira.x !== 0 || mira.y !== 0;
  const mountainOpen = revealed(mountain);
  const miraOpen = revealed(mira);
  const announcement = [
    mountainOpen && secrets[0] ? `${secretFound}. ${secrets[0].title}. ${secrets[0].body}` : "",
    miraOpen && secrets[1] ? `${secretFound}. ${secrets[1].title}. ${secrets[1].body}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="stage">
      <div className="stage-play">
      <p className="script stage-hint">{dragHint}</p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {secrets[0] ? (
        <SecretCard secret={secrets[0]} foundLabel={secretFound} open={mountainOpen} className="secret-a" />
      ) : null}
      {secrets[1] ? (
        <SecretCard secret={secrets[1]} foundLabel={secretFound} open={miraOpen} className="secret-b" />
      ) : null}
      <DraggablePhoto
        label={`${mountainCaption}. ${mountainScript}. Drag away to look underneath, or use arrow keys. Escape puts this photo back.`}
        className="polaroid-a"
        offset={mountain}
        onOffset={setMountain}
        photoRef={firstPhoto}
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
        label={`${miraCaption}. Drag away to look underneath, or use arrow keys. Escape puts this photo back.`}
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
      </div>

      {moved ? (
        <button
          type="button"
          className="reset-photos"
          onClick={() => {
            setMountain({ x: 0, y: 0 });
            setMira({ x: 0, y: 0 });
            firstPhoto.current?.focus();
          }}
        >
          {resetLabel}
        </button>
      ) : null}
    </div>
  );
}
