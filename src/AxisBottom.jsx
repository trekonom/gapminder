import { measureTextWidth } from "./utils";

const TICK_LENGTH = 0;
const TICK_TEXT_SHIFT = 10;

export const TickBottom = ({ value, label, xScale, opacity }) => (
  <g transform={`translate(${xScale(value)}, 0)`}>
    <line y2={TICK_LENGTH} stroke="currentColor" opacity={opacity} />
    <text
      className="tick-text"
      opacity={opacity}
      style={{
        textAnchor: "middle",
        alignmentBaseline: "middle",
        transform: `translateY(${TICK_TEXT_SHIFT}px)`,
      }}
    >
      {label}
    </text>
  </g>
);

export const GridBottom = ({ value, xScale, boundsHeight }) => (
  <g transform={`translate(${xScale(value)}, 0)`}>
    <line y2={-boundsHeight} stroke="currentColor" opacity={0.2} />
  </g>
);

export const AxisBottom = ({
  xScale,
  pixelsPerTick,
  title,
  subtitle,
  boundsHeight,
  ticks,
  opacity,
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
      {resolvedTicks.map(({ value, label }, i) => (
        <g>
          <TickBottom
            key={"tick-bottom-" + i}
            value={value}
            label={label}
            xScale={xScale}
            opacity={opacity}
          />
          <GridBottom
            key={"grid-bottom-" + i}
            value={value}
            xScale={xScale}
            boundsHeight={boundsHeight}
          />
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
        <g>
          <rect
            x={width - measureTextWidth(subtitle, "axis-subtitle") - 2}
            y={-6 - 12 - 2}
            width={measureTextWidth(subtitle, "axis-subtitle") + 4}
            height={12 + 4}
            fill="var(--background)"
            className="label-bg"
            style={{ transition: "opacity 150ms ease" }}
          />
          <text x={width} y={-6} className="axis-subtitle" textAnchor="end">
            {subtitle}
          </text>
        </g>
      )}
    </>
  );
};
