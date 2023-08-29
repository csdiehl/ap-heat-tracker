import { TempReading } from "../types"

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

export const findDateExtent = (data: any[]): [string, string] => {
  const sorted = data
    .filter((d) => d?.date)
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
  const firstDate = sorted[0]?.date,
    lastDate = sorted.at(-1)?.date

  return [firstDate, lastDate]
}

export const joinTemperatures = (cities: any, temps: TempReading[]): void => {
  cities.features.forEach((city: any) => {
    const temp = temps.find(
      (x) => x.city + x.code === city?.properties?.city + city?.properties?.code
    )

    city.properties.diff = temp?.diff ?? 0
    city.properties.temp = temp?.temp
  })
}

export const dataForTable = (data: any) =>
  data?.features &&
  data.features
    .sort((a: any, b: any) => b.properties.diff - a.properties.diff)
    .slice(0, 10)
    .map((d: any) => d.properties)

export const CtoF = (t: number): number => t * (9 / 5) + 32
export const FtoC = (t: number): string => ((t - 32) * (5 / 9)).toFixed(1)
export const FtoCdelta = (t: number): string => (t * (5 / 9)).toFixed(1)
