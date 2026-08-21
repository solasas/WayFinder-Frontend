# Wayfinder — Shortest Path Finder Frontend

A "cartographer's atlas" take on route-finding for Rajahmundry, India: pick a start and end
point on a map styled like a printed atlas plate, and the backend charts the route with
Dijkstra's algorithm — with up to two alternates via Yen's k-shortest-paths. A second mode
charts an isochrone: how far you can get from a point within N minutes.

## Tech Stack

- **React + Vite** — UI and dev server
- **Leaflet / react-leaflet** — interactive map with OpenStreetMap tiles, sepia-filtered to sit
  inside the atlas frame
- **Axios** — API requests to the Spring Boot backend
- **Fraunces / Inter / IBM Plex Mono** (Google Fonts) — serif headings and readouts, grotesk UI
  labels, monospace coordinates and stats

## Prerequisites

- Node.js 18+
- The [Spring Boot backend](../backend) running on `http://localhost:8080`

## Getting Started

### 1. Import road data (first time only)

Before starting the backend normally, run the graph import once:

```bash
# In the backend directory
./mvnw spring-boot:run -Dspring-boot.run.profiles=import
```

### 2. Start the backend

```bash
# In the backend directory
./mvnw spring-boot:run
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## How to Use

The **Route / Isochrone** switch at the top of the side panel (the "Field Log") picks the mode.
Both modes share the **Fastest / Shortest** toggle, which sets `optimize` on every request.

### Route mode

| Click | Action |
|-------|--------|
| 1st click | Places a brass **start** pin |
| 2nd click | Places a sienna **end** pin and fetches the route (with alternates) |
| 3rd click | Clears both pins and starts over |

Every route request asks the backend for alternates — this isn't an opt-in extra, it's just how
routing works here. Up to three routes are drawn at once, ranked by color:

| Rank | Color | Selected | Not selected |
|------|-------|----------|---------------|
| Best | brass `#C9A15C` | 5px, full opacity | 3px, 0.4 opacity |
| Alternate 1 | sienna `#8B4B3B` | 5px, full opacity | 3px, 0.4 opacity |
| Alternate 2 | muted terracotta `#A66B4F` | 5px, full opacity | 3px, 0.4 opacity |

Click a route's row in the side panel, or click its line on the map, to select it — the
distance/time readout and the map both update. If the backend only returns one route (no
distinct alternates exist for that pair), the route list is hidden and the readout shows that
single route on its own. Route rows are keyboard-accessible: Tab to a row, Enter or Space to
select it.

### Isochrone mode

Click the map to set the survey point, then drag the slider (1–30 minutes) to see how far you
can travel from it. The slider is debounced ~300ms, so rapid dragging doesn't spam the backend —
only the settled value triggers a refetch. The reachable area is rendered as a translucent sage
fill (a convex hull computed client-side over the returned node cloud); if fewer than three nodes
come back, individual points are drawn instead.

## Project Structure

```
src/
├── App.jsx                     # Root component: mode/optimize state, orchestrates the two hooks
├── App.css                     # Design tokens + all styling (atlas plate, Field Log panel, etc.)
├── main.jsx                    # Entry point, imports Leaflet CSS
├── api.js                      # fetchRegion, fetchShortestPath, fetchIsochrone, normalizeRoutes
├── components/
│   ├── MapView.jsx             # Leaflet map: tiles, bbox, pins, route polylines, isochrone fill
│   ├── SidePanel.jsx           # The "Field Log" panel shell (header, mode switch, error log note)
│   ├── ModeSwitch.jsx          # Route / Isochrone segmented control
│   ├── OptimizeToggle.jsx      # Fastest / Shortest segmented control
│   ├── RoutePanel.jsx          # Route mode's panel content
│   ├── RouteList.jsx           # Selectable list of returned routes (hidden when only one)
│   ├── IsochronePanel.jsx      # Isochrone mode's panel content (slider + readout)
│   └── Readout.jsx             # The large-serif instrument-gauge stat display
├── hooks/
│   ├── useRoutes.js            # Click-to-set-start/end flow, route fetch/selection state
│   └── useDebouncedValue.js    # Generic debounce hook (used for the isochrone slider)
└── utils/
    ├── geo.js                  # Bounding-box normalization, convex hull
    ├── mapIcons.js              # Custom SVG pin/compass Leaflet icons
    └── routeColors.js           # Rank → color/stroke-weight/opacity, shared by map + list
```

## Design System

A print-atlas aesthetic rather than a default delivery-map look:

- **Colors** — deep ink navy `#0E1B2B` (page/panels), parchment `#F4EFE4` (map matting, route-list
  cards), aged brass `#C9A15C` (primary accent, best route), sienna `#8B4B3B` and muted terracotta
  `#A66B4F` (alternate routes), muted sage `#5A6B5D` (isochrone fill)
- **Type** — Fraunces (serif) for headings and the big readout numerals, Inter (grotesk) for
  labels and controls, IBM Plex Mono for coordinates and stats
- **Signature element** — the distance/time (or isochrone minutes) readout renders as a large
  serif numeral with a thin brass rule beneath it, like an instrument gauge; everything else on
  the page stays deliberately restrained
- **Controls** — thin brass-bordered rectangular segmented controls, no rounded pills or Material
  components
- The map itself sits in a parchment-matted, brass-bordered "plate," and the OSM tiles get a
  sepia/desaturation filter so the base map doesn't clash with the palette

## API

The frontend proxies all `/api/*` requests to `http://localhost:8080` via Vite's dev server
(configured in `vite.config.js`), so there are no CORS issues during development.

| Endpoint | Description |
|----------|-------------|
| `GET /api/region` | Region name, map center, and bounding box (panning is locked to this) |
| `POST /api/shortest-path` | `{start, end, optimize, alternates: true}` → `{routes: [{path, distanceMeters, estimatedTimeSecs}, ...]}` (up to 3, sorted best to worst) |
| `GET /api/isochrone` | `?lat=&lng=&minutes=&optimize=` → `{center, minutes, reachableNodes: [{lat, lng, distance}, ...]}` |

Errors (400/404/503, or no response at all) are surfaced in the side panel's own voice — e.g.
*"No route connects those two points — they may sit on disconnected roads,"* not a generic
"Something went wrong."

## Troubleshooting

**"Cannot reach the survey office"** — Make sure the Spring Boot backend is running on port 8080.

**HTTP 403 on POST** — Add `.csrf(csrf -> csrf.disable())` to your Spring Security config (REST
APIs don't use CSRF tokens).

**"The routing engine is still loading its charts"** — Run the road data import first (see step 1
above), then restart the backend normally.
# WayFinder-Frontend
