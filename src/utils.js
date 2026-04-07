import * as d3 from "d3";

export const measureTextWidth = (text, className = "tick-text") => {
  const svg = d3.select("body").append("svg");
  const width = svg
    .append("text")
    .attr("class", className)
    .text(text)
    .node()
    .getComputedTextLength();
  svg.remove();
  return width;
};

export const computeGuideSize = (ticks, scale) => {
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

  return {
    width: rectWidth,
    height: 2 * maxValue + 20 + 5,
  };
};
