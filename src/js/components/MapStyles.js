export const cities = {
  id: "cities",
  source: "city-data",
  type: "circle",
  paint: {
    "circle-color": ["step", ["get", "diff"], "lightblue", 0, "tomato"],
  },
}
