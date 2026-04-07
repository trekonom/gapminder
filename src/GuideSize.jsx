import * as d3 from "d3";

export const GuideSize = ({ scale, ticks, opacity }) => {
  const result = ticks.reduce(
    (acc, d, i, arr) => {
      acc.sum += i === 0 ? 0 : 2 * scale(arr[i - 1].value) + 5;
      acc.items.push({
        ...d,
        lagSum: acc.sum,
      });
      return acc;
    },
    { sum: 0, items: [] },
  );

  ticks = result.items;

  const maxValue = d3.max(ticks, (d) => scale(d.value));
  const maxSum = d3.max(ticks, (d) => d.lagSum);
  const rectWidth = maxSum + 2 * maxValue + 10;

  return (
    <>
      <rect
        x={-5}
        y={-maxValue - 20}
        width={rectWidth}
        height={2 * maxValue + 20 + 5}
        fill="#fff"
        strokeOpacity={0.4}
        stroke="var(--grid-line)"
        rx={5}
        ry={5}
      />
      <text
        x={rectWidth / 2 - 5}
        y={-maxValue - 10}
        className="tick-text"
        alignmentBaseline="middle"
        opacity={0.8}
        style={{
          fontSize: "10px",
          textAnchor: "middle",
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Size shows population
      </text>
      {ticks.map(({ value, label, lagSum }, i) => (
        <g>
          <g transform={`translate(${lagSum + scale(value)}, 0)`}>
            <circle
              r={scale(value)}
              cx={0}
              cy={0}
              fill="var(--economist-blue)"
              stroke="var(--economist-blue)"
              fillOpacity={0.1}
            />
            <text
              x={0}
              y={i === 3 ? 0 : scale(value) + 1}
              className="tick-text"
              opacity={opacity}
              alignmentBaseline={i === 3 ? "middle" : "before-edge"}
              style={{
                fontSize: "8px",
                textAnchor: "middle",
              }}
            >
              {label}
              {i === 3 && " "}
              {i === 3 && (
                <tspan x={0} dy={"1.2em"}>
                  million
                </tspan>
              )}
            </text>
          </g>
        </g>
      ))}
    </>
  );
};
