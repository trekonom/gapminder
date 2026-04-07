import { useState } from "react";
import "./BubbleChart.css";
import * as d3 from "d3";
import { AxisBottom, TickBottom, SubtitleBottom } from "./AxisBottom";
import { AxisLeft, TickLeft, SubtitleLeft } from "./AxisLeft";

export default function BubbleChart({ data, width, height, margin }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const boundsWidth = width - margin.right - margin.left;
  const boundsHeight = height - margin.top - margin.bottom;

  const minValueX = d3.min(data, (d) => d.gdpPercap);
  const maxValueX = d3.max(data, (d) => d.gdpPercap);
  const minValueY = d3.min(data, (d) => d.lifeExp);
  const maxValueY = d3.max(data, (d) => d.lifeExp);
  const maxValueSize = d3.max(data, (d) => d.pop);
  const minValueSize = d3.min(data, (d) => d.pop);

  const minValueGridX = Math.max(Math.floor(minValueX / 1e3), 0.24) * 1e3;
  const maxValueGridX = 80000; //Math.ceil(maxValueX / 1e3) * 1e3;
  const minValueGridY = 19; //Math.floor(minValueY / 1) * 1;
  const maxValueGridY = 95; //Math.ceil(maxValueY / 1) * 1;
  const maxValueGridSize = Math.ceil(maxValueSize / 1e6) * 1e6;
  const minValueGridSize = Math.floor(minValueSize / 1e6) * 1e6;

  const xTicks = [
    { value: 250, label: "250" },
    { value: 500, label: "500" },
    { value: 1000, label: "1000" },
    { value: 2000, label: "2000" },
    { value: 4000, label: "4000" },
    { value: 8000, label: "8000" },
    { value: 16000, label: "16k" },
    { value: 32000, label: "32k" },
    { value: 64000, label: "64k" },
  ];

  const xScale = d3
    .scaleLog()
    .domain([minValueGridX, maxValueGridX])
    .range([0, boundsWidth])
    .base(2);
  const yScale = d3
    .scaleLinear()
    .domain([minValueGridY, maxValueGridY])
    .range([boundsHeight, 0]);
  const sizeScale = d3
    .scaleSqrt()
    .domain([minValueGridSize, maxValueGridSize])
    .range([1, 45]);
  const colorScale = d3
    .scaleOrdinal()
    .domain(["Americas", "Europe", "Asia", "Africa"])
    .range([
      "var(--americas-color)",
      "var(--europe-color)",
      "var(--asia-color)",
      "var(--africa-color)",
    ]);

  const header = (
    <div className="header" style={{ width: width }}>
      <div className="headerLine" />
      <div className="headerBox" />
      <span className="title">Gapminder World Health Chart</span>
      <br />
      <span className="subtitle">
        This chart maps countries by health and wealth: Up and down show
        healthier to sicker; left and right show poorer to richer. Each bubble
        represents a country’s average life expectancy and income in 2007.
      </span>
    </div>
  );

  const footer = (
    <div className="footer">
      <span>Data Source: www.gapminder.org</span>
    </div>
  );

  const plotBackground = (
    <rect x={0} y={0} width={width} height={height} className="plot-bg" />
  );

  const isActive = hoveredCountry === null;

  const allCircles = [...data]
    .sort((a, b) => b.pop - a.pop)
    .map((d, i) => {
      const isActiveNone = hoveredCountry === null;
      const isActiveCountry =
        hoveredCountry && hoveredCountry.country === d.country;

      return (
        <g
          key={i}
          onMouseEnter={() => setHoveredCountry(d)}
          onMouseLeave={() => {
            setHoveredCountry(null);
          }}
        >
          <circle
            key={"circle-" + i}
            cx={xScale(d.gdpPercap)}
            cy={yScale(d.lifeExp)}
            r={sizeScale(d.pop)}
            fill={colorScale(d.continent)}
            opacity={isActiveNone ? 0.8 : isActiveCountry ? 1 : 0.1}
            stroke={"black"}
            strokeWidth={1}
            strokeOpacity={0.8}
          />
          {isActiveCountry && (
            <g>
              <line
                className="tick-hover-line"
                x1={0}
                y1={yScale(d.lifeExp)}
                x2={xScale(d.gdpPercap) - sizeScale(d.pop)}
                y2={yScale(d.lifeExp)}
              />
              <line
                className="tick-hover-line"
                x1={xScale(d.gdpPercap)}
                y1={boundsHeight}
                x2={xScale(d.gdpPercap)}
                y2={yScale(d.lifeExp) + sizeScale(d.pop)}
              />
              <text
                x={
                  xScale(d.gdpPercap) +
                  (d.gdpPercap > 500 ? -1 : 1) * (sizeScale(d.pop) + 2)
                }
                y={yScale(d.lifeExp) - sizeScale(d.pop) - 2}
                textAnchor={d.gdpPercap > 500 ? "end" : "start"}
                alignmentBaseline="middle"
                className="tick-hover-text"
              >
                {d.country}
              </text>
            </g>
          )}
        </g>
      );
    });

  return (
    <>
      {header}
      <svg
        width={width}
        height={height}
        overflow="visible"
        className="economist-barchart"
      >
        {plotBackground}
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          {allCircles}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              title="GDP per capita"
              boundsHeight={boundsHeight}
              ticks={xTicks}
              opacity={hoveredCountry ? 0.2 : 1}
            />
            {hoveredCountry && (
              <TickBottom
                value={hoveredCountry.gdpPercap}
                label={
                  hoveredCountry.gdpPercap < 10000
                    ? hoveredCountry.gdpPercap.toFixed(0)
                    : (hoveredCountry.gdpPercap / 1000).toFixed(1) + "k"
                }
                xScale={xScale}
                boundsHeight={boundsHeight}
              />
            )}
          </g>
          <AxisLeft
            yScale={yScale}
            pixelsPerTick={60}
            title="Life Expectancy"
            boundsWidth={boundsWidth}
            opacity={hoveredCountry ? 0.2 : 1}
          />
          {hoveredCountry && (
            <TickLeft
              value={hoveredCountry.lifeExp}
              label={hoveredCountry.lifeExp.toFixed(1)}
              yScale={yScale}
              boundsWidth={boundsWidth}
            />
          )}
          <g transform={`translate(0, ${boundsHeight})`}>
            <SubtitleBottom
              subtitle="PPP (constant 2007 international $)"
              width={boundsWidth}
            />
          </g>
          <SubtitleLeft subtitle="at birth" />
        </g>
      </svg>
      {footer}
    </>
  );
}
