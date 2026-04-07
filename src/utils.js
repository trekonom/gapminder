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
