export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export const findDateExtent = (data) => {
  const sorted = data
    .filter((d) => d?.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const firstDate = sorted[0]?.date,
    lastDate = sorted.at(-1)?.date

  return [firstDate, lastDate]
}

export const joinTemperatures = (cities, temps) => {
  cities.features.forEach((city) => {
    const temp = temps.find(
      (x) => x.city + x.code === city?.properties?.city + city?.properties?.code
    )

    city.properties.diff = temp?.diff ?? 0
  })
}

export const dataForTable = (data) =>
  data?.features &&
  data.features
    .sort((a, b) => b.properties.diff - a.properties.diff)
    .slice(0, 10)
    .map((d) => d.properties)

export const CtoF = (t) => t * (9 / 5) + 32
export const FtoC = (t) => (t - 32) * (5 / 9)
