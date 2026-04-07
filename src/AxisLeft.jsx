const TICK_LENGTH = 0;
const TICK_TEXT_SHIFT = 10;

export const AxisLeft = ({
  yScale,
  pixelsPerTick,
  title,
  subtitle,
  boundsWidth,
}) => {
  const range = yScale.range();
  const height = range[0] - range[1];
  const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

  return (
    <>
      <path
        d={["M", 0, range[0], "L", 0, range[1]].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {yScale.ticks(numberOfTicksTarget).map((value) => (
        <g
          key={value}
          className="tick"
          transform={`translate(0, ${yScale(value)})`}
        >
          <line x2={boundsWidth} stroke="currentColor" opacity={0.2} />
          <line x2={-TICK_LENGTH} stroke="currentColor" />
          <text
            className="tick-text"
            style={{
              textAnchor: "middle",
              alignmentBaseline: "middle",
              transform: `translateX(${-TICK_TEXT_SHIFT}px)`,
            }}
          >
            {value}
          </text>
        </g>
      ))}

      {/* Axis title — rotated 90° */}
      {title && (
        <text
          x={-height / 2}
          y={-25}
          textAnchor="middle"
          transform="rotate(-90)"
          className="axis-title"
        >
          {title}
        </text>
      )}
      {/* Axis subtitle */}
      {subtitle && (
        <text
          x={0}
          y={0}
          textAnchor="end"
          alignmentBaseline="before-edge"
          transform="rotate(-90)"
          className="axis-subtitle"
        >
          {subtitle}
        </text>
      )}
    </>
  );
};
