const TICK_LENGTH = 0;
const TICK_TEXT_SHIFT = 10;

export const AxisBottom = ({
  xScale,
  pixelsPerTick,
  title,
  subtitle,
  boundsHeight,
  ticks,
}) => {
  const range = xScale.range();
  const width = range[1] - range[0];

  const resolvedTicks = ticks
    ? ticks
    : (() => {
        const numberOfTicksTarget = Math.floor(width / pixelsPerTick);
        return xScale
          .ticks(numberOfTicksTarget)
          .map((v) => ({ value: v, label: v }));
      })();

  return (
    <>
      <line
        x1={range[0]}
        y1={0}
        x2={range[1]}
        y2={0}
        stroke="currentColor"
        fill="none"
      />
      {resolvedTicks.map(({ value, label: tickLabel }) => (
        <g key={value} transform={`translate(${xScale(value)}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <line y2={-boundsHeight} stroke="currentColor" opacity={0.2} />
          <text
            className="tick-text"
            style={{
              textAnchor: "middle",
              alignmentBaseline: "middle",
              transform: `translateY(${TICK_TEXT_SHIFT}px)`,
            }}
          >
            {tickLabel}
          </text>
        </g>
      ))}

      {/* Axis title */}
      {title && (
        <text x={width / 2} y={35} className="axis-title" textAnchor="middle">
          {title}
        </text>
      )}
      {/* Axis subtitle */}
      {subtitle && (
        <text x={width} y={-6} className="axis-subtitle" textAnchor="end">
          {subtitle}
        </text>
      )}
    </>
  );
};
