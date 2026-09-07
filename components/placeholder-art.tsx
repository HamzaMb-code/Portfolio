/** Abstract duotone placeholder standing in for case-study photography. */
export function PlaceholderArt({
  hue,
  className,
  label,
}: {
  hue: number;
  className?: string;
  label?: string;
}) {
  const a = `hsl(${hue} 55% 14%)`;
  const b = `hsl(${(hue + 40) % 360} 60% 8%)`;
  const line = `hsl(${hue} 70% 55% / 0.35)`;
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(120% 140% at 15% 15%, ${a}, ${b} 65%)`,
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, opacity: 0.5 }}
      >
        <defs>
          <pattern
            id={`grid-${hue}`}
            width="56"
            height="56"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 56 0 L 0 0 0 56"
              fill="none"
              stroke={line}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${hue})`} />
      </svg>
      {label ? (
        <span
          style={{
            position: "absolute",
            left: 10,
            bottom: 8,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
