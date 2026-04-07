import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BubbleChart from "./BubbleChart.jsx";
import { data } from "./data/gapminder.js";

// The chart dimensions (often passed as prop too)
const width = 640;
const height = 480;

const MARGIN = {
  top: 10,
  right: 30,
  bottom: 40,
  left: 45,
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BubbleChart data={data} width={width} height={height} margin={MARGIN} />
  </StrictMode>,
);
