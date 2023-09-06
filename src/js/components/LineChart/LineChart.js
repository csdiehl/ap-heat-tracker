import { useNodeDimensions } from "ap-react-hooks"
import { extent } from "d3-array"
import { scaleLinear, scalePoint } from "d3-scale"
import { select } from "d3-selection"
import "d3-transition"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { TtHeader, colors } from "../settings"
import drawChart from "./drawChart"
import {
  Area,
  BaseLine,
  Button,
  ChartWrapper,
  Container,
  GridLine,
  Label,
  MainLine,
} from "./styles"
import { formatData, sliceDataByTime } from "./utils"

const margin = { bottom: 20, top: 16, right: 0, left: 16 }
const timePeriods = ["year", "6_months", "3_months", "1_month"]

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

      drawChart(svg, chartData, margin, width, timeFrame, xScale, yScale)
    }
  }, [chartData, width, height, timeFrame])

  return (
    <Container>
      <div
        style={{ display: "flex", gap: "16px", justifyContent: "flex-start" }}
      >
        <TtHeader>Global air temperature change from normal</TtHeader>
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
