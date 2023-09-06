import { useNodeDimensions } from "ap-react-hooks"
import { extent } from "d3-array"
import { scaleLinear, scalePoint } from "d3-scale"
import { select } from "d3-selection"
import { area, line } from "d3-shape"
import "d3-transition"
import React, { useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import { AbsolutePos, CardBackground } from "./mixins"
import { TtHeader, colors } from "./settings"
import { axisBottom } from "d3-axis"

const Container = styled.div`
  ${AbsolutePos}
  ${CardBackground}
  bottom: 0;
  left: 8px;
  height: 200px;
  width: calc(100% - 16px);
  max-width: 1300px;
  grid-area: chart;
  display: grid;
  grid-template-rows: 20px minmax(0, 1fr);
  grid-template-columns: 100%;
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const MainLine = styled.path`
  stroke: ${(props) => props.color ?? "#FFF"};
  stroke-width: ${(props) => props.width ?? 2};
  fill: none;
  stroke-line-join: round;
`

const Area = styled.path`
  fill: ${(props) => props.color};
  stroke: none;
  opacity: 0.2;
`

const BaseLine = styled.line`
  stroke: lightgrey;
  stroke-dasharray: 2 2;
`

const GridLine = styled.line`
  stroke: #181818;
  opacity: 0.5;
`

const Button = styled.button`
  all: unset;
  cursor: pointer;
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.2)" : "none"};
  border-radius: 5px;
  color: #fff;
  transition: background 200ms ease-in;
  font-size: 0.75rem;
  line-height: 0.75rem;
  font-weight: 500;
  padding: 8px;
`

const Label = styled.text`
  font-size: 0.75rem;
  font-weight: bold;
  fill: ${(props) => props.color ?? "white"};
  alignment-baseline: middle;
  stroke: black;
  paint-order: stroke fill;
`

const margin = { bottom: 20, top: 16, right: 0, left: 16 }
const timePeriods = ["year", "6_months", "3_months", "1_month"]

const averageLabel = "1979-2000 mean"

const searchData = (data, label) =>
  data.find((d) => d?.name === label)?.data?.filter((d) => d !== null)

const sliceDataByTime = (data, timeFrame) => {
  if (timeFrame === "year") return data

  const daysAgo =
    timeFrame === "6_months" ? 180 : timeFrame === "3_months" ? 90 : 30
  return data.slice(data.length - daysAgo, data.length)
}

const subtract = (a, b) => {
  if (a === null) return null
  return +(a - b).toFixed(2)
}

const dateFromDay = (year, day) =>
  new Date(year, 0, day).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  })

function formatData(data) {
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
    lastYear: lastYearDiff[i],
  }))

  return chartData
}

// component
const LineChart = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState("year")
  const svgRef = useRef()
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  // get data for current year, average and difference
  const formattedData = useMemo(() => {
    return data && formatData(data)
  }, [data])

  const chartData = sliceDataByTime(formattedData, timeFrame)

  useEffect(() => {
    if (chartData) {
      const svg = select(svgRef.current)

      const dataExtent = extent(formattedData, (d) => d.diff)
      const days = chartData.map((d) => d.day)

      const yScale = scaleLinear()
        .domain([dataExtent[0] < 0 ? dataExtent[0] : 0, dataExtent[1]])
        .range([height - margin.bottom, margin.top])
      const xScale = scalePoint()
        .domain(days)
        .range([margin.left, width - margin.right])

      // generators
      const lineGenerator = line(
        (d) => xScale(d.day),
        (d) => yScale(d.diff)
      )

      const line2 = line(
        (d) => xScale(d.day),
        (d) => yScale(d.lastYear)
      )

      const areaGenerator = area(
        (d) => xScale(d.day),
        (d) => yScale(d.lastYear),
        (d) => yScale(d.diff)
      )

      const area2 = area(
        (d) => xScale(d.day),
        yScale(0),
        (d) => yScale(d.diff)
      )

      svg
        .selectAll("#chart-main-line")
        .transition()
        .duration(750)
        .attr("d", lineGenerator(chartData))

      svg
        .selectAll("#secondary-line")
        .transition()
        .duration(750)
        .attr("d", line2(chartData))

      svg
        .selectAll("#background-area")
        .transition()
        .duration(750)
        .attr("d", area2(chartData))

      svg
        .selectAll("#year-over-year-positive")
        .transition()
        .duration(750)
        .attr("d", areaGenerator(chartData))

      svg
        .selectAll(".grid-line")
        .data([0, 0.5, 1])
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", (d) => yScale(d))
        .attr("y2", (d) => yScale(d))

      svg
        .selectAll(".grid-line-label")
        .data([1, 0.5])
        .attr("y", (d) => yScale(d))

      const tickSpacing =
        timeFrame === "year" ? 20 : timeFrame === "6_months" ? 10 : 5
      const xAxis = axisBottom(xScale).tickValues(
        xScale.domain().filter((d, i) => i % tickSpacing == 0)
      )

      svg
        .select("#x-axis")
        .transition()
        .duration(750)
        .call(xAxis)
        .select(".domain")
        .attr("stroke-width", 0)

      svg
        .selectAll(".y-axis-label")
        .data([chartData[0].diff, chartData[0].lastYear])
        .transition()
        .duration(500)
        .attr("y", (d) => yScale(d))
    }
  }, [chartData, width, height, timeFrame])

  return (
    <Container>
      <div
        style={{ display: "flex", gap: "16px", justifyContent: "flex-start" }}
      >
        <TtHeader>Global 2-meter air temperature anomaly</TtHeader>
        <div>
          {timePeriods.map((d) => (
            <Button
              active={d === timeFrame}
              key={d}
              onClick={() => setTimeFrame(d)}
            >
              {d.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>
      <ChartWrapper ref={node}>
        <svg width={width} height={height} ref={svgRef}>
          <defs>
            <linearGradient id="gradient1" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor={"white"} offset="0%" />
              <stop stopColor={colors[0]} offset="100%" />
            </linearGradient>
          </defs>

          <path
            opacity={0.8}
            fill="url(#gradient1)"
            id="background-area"
          ></path>

          <BaseLine id="chart-base-line" className="grid-line"></BaseLine>
          <GridLine className="grid-line"></GridLine>
          <GridLine className="grid-line"></GridLine>

          <Area color="white" id="year-over-year-positive"></Area>
          <MainLine color="#999" id="secondary-line"></MainLine>
          <MainLine color={"white"} id="chart-main-line"></MainLine>

          <Label x={0} y={height - margin.bottom} className="axis-label">
            Baseline 1979 - 2000
          </Label>

          <Label x={0} className="y-axis-label">
            2023
          </Label>

          <Label color="#999" x={0} className="y-axis-label">
            2022
          </Label>
          {[1, 0.5].map((d) => (
            <Label x={width - margin.right - 40} className="grid-line-label">
              +{d} F
            </Label>
          ))}

          <g
            transform={`translate(0, ${height - margin.bottom})`}
            color="#FFF"
            id="x-axis"
          ></g>
        </svg>
      </ChartWrapper>
    </Container>
  )
}

export default LineChart
