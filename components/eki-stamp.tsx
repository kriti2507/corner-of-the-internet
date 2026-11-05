export function EkiStamp({ label }: { label: string }) {
  return (
    <div className="eki-stamp" aria-hidden="true">
      <svg viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="#f3eee3" stroke="#8f3d3d" strokeWidth="2.4" />
        <circle cx="36" cy="36" r="24" fill="none" stroke="#8f3d3d" strokeWidth="1.2" />
        <text
          x="36"
          y="41"
          textAnchor="middle"
          fill="#8f3d3d"
          fontSize="16"
          fontFamily="Georgia, serif"
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
