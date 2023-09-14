import { ReanalyzerDataEntry } from "../../types"
import { LineChartData } from "./LineChart"

const averageLabel = "1979-2000 mean"

const searchData = (data: ReanalyzerDataEntry[], label: string): number[] =>
  data.find((d) => d?.name === label)?.data?.filter((d) => d !== null)

const sliceDataByTime = (
  data: LineChartData[],
  timeFrame: string
): LineChartData[] => {
  if (timeFrame === "year") return data

  const daysAgo =
    timeFrame === "6_months" ? 180 : timeFrame === "3_months" ? 90 : 30
  return data.slice(data.length - daysAgo, data.length)
}

const subtract = (a: number, b: number): number => {
  if (a === null) return null
  return +(a - b).toFixed(2)
}

const dateFromDay = (year: number, day: number): string =>
  new Date(year, 0, day).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  })

function formatData(data: ReanalyzerDataEntry[]): LineChartData[] {
  // get data for current year, average and difference
  const thisYearData = searchData(data, "2023")
  const lastYearData = searchData(data, "2022")
  const meanData = searchData(data, averageLabel).slice(0, thisYearData?.length)
  const diff = thisYearData.map((d, i) => subtract(d, meanData[i]))
  const lastYearDiff = lastYearData.map((d, i) => subtract(d, meanData[i]))

  // filter the data to the right time period
  const chartData = diff.map((d, i) => ({
    day: dateFromDay(2023, i),
    diff: d,
    temp: thisYearData[i],
    lastYear: lastYearDiff[i],
  }))

  return chartData
}

export { sliceDataByTime, formatData }
