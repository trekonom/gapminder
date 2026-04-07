# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build to dist/
npm run lint     # Run ESLint on all .js/.jsx files
npm run preview  # Preview production build
```

No test framework is configured.

## Architecture

Single-page React + D3 application rendering an interactive bubble chart (Gapminder-style).

**Render pipeline:** `index.html` → `src/main.jsx` (React root) → `<BubbleChart />` component

- `src/main.jsx` — mounts React app in strict mode
- `src/BubbleChart.jsx` — main (and only) component; D3 integration goes here
- `src/BubbleChart.css` — component styles

D3 is a runtime dependency (`d3` v7) intended to be used inside `BubbleChart.jsx` for SVG rendering and data binding. React handles the component lifecycle; D3 is used for scales, axes, and transitions rather than for DOM manipulation (use refs to hand off a DOM node to D3).

## Tech Stack

- React 19, D3 7, Vite 8 (with `@vitejs/plugin-react` using Oxc compiler)
- ESLint 9 — uppercase variables and underscore-prefixed variables are exempt from `no-unused-vars`
- ES modules throughout (no CommonJS)
