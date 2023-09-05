import React, { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { useNodeDimensions } from "ap-react-hooks"
import { scaleLinear, scalePoint } from "d3-scale"
import { extent } from "d3-array"
import { line, area } from "d3-shape"
import { select } from "d3-selection"
import "d3-transition"
import { colors } from "./settings"

const Container = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1300px;
  background: none;
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

const margin = { bottom: 16, top: 16, right: 0, left: 0 }
const timePeriods = ["year", "6_months", "3_months"]

const averageLabel = "1979-2000 mean"

const searchData = (data, label) =>
  data.find((d) => d?.name === label)?.data?.filter((d) => d !== null)

const sliceDataByTime = (data, timeFrame) =>
  timeFrame === "year"
    ? data
    : timeFrame === "6_months"
    ? data.slice(-24 * 7)
    : data.slice(-12 * 7)

const subtract = (a, b) => {
  if (a === null) return null
  return +(a - b).toFixed(2)
}

const LineChart = ({ data }) => {
  const [timeFrame, setTimeFrame] = useState("year")
  const svgRef = useRef()
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  useEffect(() => {
    if (data) {
      const svg = select(svgRef.current)

      // get data for current year, average and difference
      const thisYearData = searchData(data, "2023")
      const lastYearData = searchData(data, "2022")
      const meanData = searchData(data, averageLabel).slice(
        0,
        thisYearData?.length
      )
      const diff = thisYearData.map((d, i) => subtract(d, meanData[i]))

      const lastYearDiff = lastYearData.map((d, i) => subtract(d, meanData[i]))

      // filter the data to the right time period
      const chartData = sliceDataByTime(diff, timeFrame)

      const dataExtent = extent(chartData)
      const days = [...chartData.keys()]

      const yScale = scaleLinear()
        .domain([dataExtent[0] < 0 ? dataExtent[0] : 0, dataExtent[1]])
        .range([height - margin.bottom, margin.top])
      const xScale = scalePoint()
        .domain(days)
        .range([margin.left, width - margin.right])

      console.log(yScale.range(), yScale.domain())

      // generators
      const lineGenerator = line(
        (d, i) => xScale(i),
        (d) => yScale(d)
      )

      const areaGenerator = area(
        (d, i) => xScale(i),
        (d, i) => yScale(lastYearDiff[i]),
        (d) => yScale(d)
      )

      const area2 = area(
        (d, i) => xScale(i),
        yScale(0),
        (d) => yScale(d)
      )

      console.log(area2(chartData))
      svg
        .selectAll("#chart-main-line")
        .transition()
        .duration(750)
        .attr("d", lineGenerator(chartData))

      svg
        .selectAll("#secondary-line")
        .transition()
        .duration(750)
        .attr("d", lineGenerator(lastYearDiff))

      svg.selectAll("#background-area").attr("d", area2(chartData))

      svg
        .selectAll("#year-over-year-positive")
        .transition()
        .duration(750)
        .attr(
          "d",
          areaGenerator(
            chartData.map((d, i) =>
              d >= lastYearDiff[i] ? d : lastYearDiff[i]
            )
          )
        )

      svg
        .selectAll("#chart-base-line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
    }
  }, [data, width, height, timeFrame])

  return (
    <Container>
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
      <ChartWrapper ref={node}>
        <svg width={width} height={height} ref={svgRef}>
          <defs>
            <linearGradient id="gradient1" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor={colors[3]} offset="0%" />
              <stop stopColor={colors[0]} offset="100%" />
            </linearGradient>
          </defs>
          <path
            opacity={0.8}
            fill="url(#gradient1)"
            id="background-area"
          ></path>
          <Area color="white" id="year-over-year-positive"></Area>
          <MainLine color="#555" id="secondary-line"></MainLine>
          <MainLine color={colors[3]} id="chart-main-line"></MainLine>
          <text id="main-line-text"></text>
          <text id="last-year-line-tex"></text>
          <text id="baseline-text"></text>

          <BaseLine id="chart-base-line"></BaseLine>
        </svg>
      </ChartWrapper>
    </Container>
  )
}

export default LineChart
