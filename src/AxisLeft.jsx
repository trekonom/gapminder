import { measureTextWidth } from "./utils";

const TICK_LENGTH = 0;
const TICK_TEXT_SHIFT = 6;

export const TickLeft = ({ value, label, yScale, opacity }) => (
  <g className="tick" transform={`translate(0, ${yScale(value)})`}>
    <line x2={-TICK_LENGTH} stroke="currentColor" opacity={opacity} />
    <text
      className="tick-text"
      opacity={opacity}
      style={{
        textAnchor: "end",
        alignmentBaseline: "middle",
        transform: `translateX(${-TICK_TEXT_SHIFT}px)`,
      }}
    >
      {label}
    </text>
  </g>
);

export const GridLeft = ({ value, yScale, boundsWidth }) => (
  <g className="tick" transform={`translate(0, ${yScale(value)})`}>
    <line x2={boundsWidth} stroke="currentColor" opacity={0.2} />
  </g>
);

export const SubtitleLeft = ({ subtitle }) => (
  <g>
    <rect
      x={1}
      y={0}
      width={12 + 4}
      height={measureTextWidth(subtitle, "axis-subtitle") + 4}
      fill="var(--background)"
      className="label-bg"
      style={{ transition: "opacity 150ms ease" }}
    />
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
  </g>
);

export const AxisLeft = ({
  yScale,
  pixelsPerTick,
  title,
  subtitle,
  boundsWidth,
  opacity,
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
      {yScale.ticks(numberOfTicksTarget).map((value, i) => (
        <g>
          <TickLeft
            key={"tick-left-" + i}
            value={value}
            label={value}
            yScale={yScale}
            opacity={opacity}
          />
          <GridLeft
            key={"grid-left-" + i}
            value={value}
            yScale={yScale}
            boundsWidth={boundsWidth}
          />
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
      {subtitle && <SubtitleLeft subtitle={subtitle} />}
    </>
  );
};
