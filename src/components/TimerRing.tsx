interface Props {
  progress: number;
  w: number;
  h: number;
  pad?: number;
  stroke?: number;
}

export default function TimerRing({
  progress,
  w,
  h,
  pad = 12,
  stroke = 5,
}: Props) {
  const sw = w + pad * 2;
  const sh = h + pad * 2;
  const rx = 18;
  const clamped = Math.max(0, Math.min(1, progress));
  const offset = 1000 * (1 - clamped);
  const danger = clamped < 0.25;
  const color = danger ? '#c8102e' : '#d4af37';

  return (
    <svg
      width={sw}
      height={sh}
      className="pointer-events-none absolute"
      style={{
        left: -pad,
        top: -pad,
        filter: `drop-shadow(0 0 8px ${danger ? 'rgba(200,16,46,0.65)' : 'rgba(212,175,55,0.55)'})`,
        transition: 'filter 0.3s ease',
      }}
    >
      <rect
        x={stroke / 2}
        y={stroke / 2}
        width={sw - stroke}
        height={sh - stroke}
        rx={rx}
        ry={rx}
        fill="none"
        stroke="#d4af37"
        strokeOpacity="0.16"
        strokeWidth={stroke}
        pathLength={1000}
      />
      <rect
        x={stroke / 2}
        y={stroke / 2}
        width={sw - stroke}
        height={sh - stroke}
        rx={rx}
        ry={rx}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray={1000}
        strokeDashoffset={offset}
        style={{
          transition: 'stroke-dashoffset 0.12s linear, stroke 0.3s ease',
        }}
      />
    </svg>
  );
}
