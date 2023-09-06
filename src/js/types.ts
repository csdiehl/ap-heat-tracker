interface Months {
  jun?: number
  jul?: number
  aug?: number
  sep?: number
  oct?: number
  dec?: number
  jan?: number
  feb?: number
  mar?: number
  apr?: number
  may?: number
}

interface TempValues {
  code: string
  city: string
  temp: number
  date: string
  diff: number
}

export type TempReading = TempValues & Months

export interface CityProperties {
  code: string
  city: string
  pop: number
  station: string
  country: string
  distance: number
  diff?: number
}

export type TempScale = "Farenheit" | "Celsius"
export type Month =
  | "aug"
  | "sep"
  | "jul"
  | "jun"
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "dec"
  | "oct"

// this describes the format we expect the climate re-analyzer data to be in
export interface ReanalyzerDataEntry {
  name: string
  data: number[]
}
