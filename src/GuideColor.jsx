import { useState, useEffect, useMemo } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";

// ISO 3166-1 numeric codes grouped by Gapminder region
const CONTINENT_IDS = {
  Africa: new Set([
    12, 24, 72, 108, 120, 140, 148, 174, 175, 178, 180, 204, 231, 232, 262, 266,
    270, 288, 324, 384, 404, 426, 430, 434, 450, 454, 466, 478, 504, 508, 516,
    562, 566, 646, 686, 694, 706, 710, 716, 728, 736, 768, 800, 818, 834, 894,
  ]),
  Americas: new Set([
    28, 32, 44, 52, 60, 68, 76, 84, 124, 136, 152, 170, 188, 192, 212, 214, 218,
    222, 238, 254, 312, 320, 328, 332, 340, 388, 474, 484, 500, 531, 535, 558,
    591, 600, 604, 630, 740, 780, 796, 840, 850, 858, 862,
  ]),
  Europe: new Set([
    8, 20, 40, 56, 70, 100, 112, 191, 196, 203, 208, 233, 246, 250, 276, 300,
    336, 348, 352, 372, 380, 428, 438, 440, 442, 470, 492, 498, 499, 528, 578,
    304, 616, 620, 642, 643, 674, 688, 703, 705, 724, 752, 756, 762, 795, 804,
    807, 826,
  ]),
  Asia: new Set([
    // Asia
    4, 31, 50, 64, 96, 104, 116, 156, 158, 268, 275, 356, 360, 364, 368, 376,
    392, 398, 400, 408, 410, 414, 418, 422, 458, 462, 496, 524, 586, 608, 634,
    682, 704, 784, 792, 860, 887,
    // Oceania
    36, 90, 242, 296, 520, 548, 554, 583, 584, 585, 598, 776, 798, 882,
  ]),
};

function getContinent(numericId) {
  for (const [continent, ids] of Object.entries(CONTINENT_IDS)) {
    if (ids.has(numericId)) return continent;
  }
  return null;
}

export const GuideColor = ({
  colorScale,
  width = 200,
  height = 120,
  padding = 5,
}) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json",
    ).then((world) => {
      setGeoData(topojson.feature(world, world.objects.countries));
    });
  }, []);

  const titleHeight = 20;

  const projection = useMemo(
    () =>
      d3.geoNaturalEarth1().fitExtent(
        [
          [-padding, 0],
          [width + padding, height - titleHeight],
        ],
        { type: "Sphere" },
      ),
    [width, height, padding],
  );

  const pathGenerator = useMemo(
    () => d3.geoPath().projection(projection),
    [projection],
  );

  return (
    <>
      <rect
        x={-padding}
        y={-titleHeight}
        width={width + 2 * padding}
        height={height}
        fill="#fff"
        strokeOpacity={0.4}
        //stroke="var(--grid-line)"
        rx={5}
        ry={5}
      />
      <text
        x={width / 2}
        y={-titleHeight / 2}
        className="tick-text"
        alignmentBaseline="middle"
        style={{
          fontSize: "10px",
          textAnchor: "middle",
          //fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Color shows region
      </text>
      {geoData &&
        geoData.features
          .filter((feature) => +feature.id !== 10) // drop Antarctica
          .map((feature, i) => {
            const continent = getContinent(+feature.id);
            return (
              <path
                key={i}
                d={pathGenerator(feature)}
                fill={continent ? colorScale(continent) : "#ccc"}
                fillOpacity={continent ? 0.85 : 0.25}
                stroke="#fff"
                strokeWidth={0.3}
              />
            );
          })}
    </>
  );
};
