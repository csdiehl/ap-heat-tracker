import { CircleLayer, RasterLayer, SymbolLayer } from "mapbox-gl"
import { colors, citySizes } from "./settings"
import { ExpressionSpecification } from "maplibre-gl"

const breaks = [0, 2, 4, 6, 8]

const colorScale: ExpressionSpecification = [
  "step",
  ["number", ["get", "diff"]],
  colors[0],
  0,
  colors[1],
  2,
  colors[2],
  4,
  colors[3],
  6,
  colors[4],
  8,
  colors[5],
]

export const cities: CircleLayer = {
  id: "cities",
  source: "city-data",
  type: "circle",
  paint: {
    "circle-color": colorScale,
    "circle-stroke-opacity": 0.3,
    "circle-radius": 3,
    "circle-stroke-color": colorScale,
    "circle-stroke-width": [
      "step",
      ["get", "pop"],
      citySizes[0],
      10_000,
      citySizes[1],
      100_000,
      citySizes[2],
      1_000_000,
      citySizes[3],
    ],
  },
}

export const clusteredCities: CircleLayer = {
  id: "clusters",
  type: "circle",
  source: "cities",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["/", ["get", "avg_diff"], ["get", "point_count"]],
      colors[0],
      -10,
      colors[1],
      -5,
      colors[2],
      0,
      colors[3],
      5,
      colors[4],
      10,
      colors[5],
    ],
    "circle-radius": ["step", ["get", "point_count"], 10, 100, 15, 750, 20],
  },
}

export const clusterCounts: SymbolLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "cities",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated} cities",
    "text-font": ["Arial Regular"],
    "text-size": 14,
  },
  paint: {
    "text-color": "lightgrey",
    "text-halo-color": "#121212",
    "text-halo-width": 1,
  },
}

export const heatTiles: RasterLayer = {
  id: "heat-tiles",
  type: "raster",
  source: "heat-tiles-data",
  paint: {
    "raster-opacity": 0.5,
    "raster-contrast": 0.3,
    "raster-fade-duration": 200,
  },
}
