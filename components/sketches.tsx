export function MountainSketch() {
  return (
    <svg viewBox="0 0 240 240" className="sketch" aria-hidden="true">
      <rect width="240" height="240" fill="#c5d7ea" />
      <circle cx="178" cy="58" r="18" fill="#fffdf8" stroke="#1c2744" strokeWidth="3" />
      <path
        d="M6 188 L58 118 L96 156 L132 86 L176 150 L214 112 L236 156 L236 222 L6 222 Z"
        fill="#f4efe6"
        stroke="#1c2744"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M132 86 L146 118 L118 118 Z" fill="#fffdf8" stroke="#1c2744" strokeWidth="2" />
    </svg>
  );
}

export function MiraSketch() {
  return (
    <svg viewBox="0 0 240 240" className="sketch" aria-hidden="true">
      <rect width="240" height="240" fill="#f4c9c4" />
      <ellipse cx="120" cy="168" rx="46" ry="28" fill="#fffdf8" stroke="#1c2744" strokeWidth="3" />
      <path
        d="M92 168c6 10 18 16 28 16s22-6 28-16"
        fill="none"
        stroke="#1c2744"
        strokeWidth="3"
      />
      <circle cx="120" cy="104" r="38" fill="#fffdf8" stroke="#1c2744" strokeWidth="3" />
      <path
        d="M86 100c-8-28 10-48 34-46 26 2 42 22 36 48-8-18-22-26-36-24-16-2-28 8-34 22z"
        fill="#1c2744"
      />
      <circle cx="86" cy="92" r="10" fill="#1c2744" />
      <circle cx="154" cy="92" r="10" fill="#1c2744" />
      <circle cx="106" cy="108" r="3.5" fill="#1c2744" />
      <circle cx="134" cy="108" r="3.5" fill="#1c2744" />
      <path d="M112 122c4 6 12 6 16 0" fill="none" stroke="#1c2744" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
