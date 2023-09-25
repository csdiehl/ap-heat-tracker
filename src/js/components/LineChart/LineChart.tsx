import Dropdown from "./Dropdown"
import { useNodeDimensions } from "ap-react-hooks"
import { extent } from "d3-array"
import { scaleLinear, scalePoint } from "d3-scale"
import { select } from "d3-selection"
import "d3-transition"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { ReanalyzerDataEntry, TempScale } from "../../types"
import { TtHeader, colors } from "../settings"
import { FtoCdelta } from "../utils"
import ButtonSet from "./ButtonSet"
import drawChart from "./drawChart"
import {
  Area,
  BaseLine,
  ChartWrapper,
  Container,
  GridLine,
  Header,
  Label,
  MainLine,
  Tooltip,
} from "./styles"
import { formatData, sliceDataByTime } from "./utils"
import drawTooltip from "./drawTooltip"

export interface Margin {
  bottom: number
  top: number
  left: number
  right: number
}

const margin: Margin = { bottom: 20, top: 16, right: 0, left: 16 }
const mainColor = "#FF447D"

interface LineChartProps {
  tempScale: TempScale
  data: ReanalyzerDataEntry[]
}

export interface LineChartData {
  diff: number
  lastYear: number
  day: string
}

// component
const LineChart = ({ tempScale, data }: LineChartProps) => {
  const [timeFrame, setTimeFrame] = useState("year")
  const svgRef = useRef()
  const tooltipRef = useRef()
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  // get data for current year, average and difference
  const formattedData: LineChartData[] = useMemo(() => {
    return data && formatData(data)
  }, [data])

  const chartData: LineChartData[] = sliceDataByTime(formattedData, timeFrame)

  useEffect(() => {
    if (chartData) {
      const svg = select(svgRef.current)
      const tooltip = select(tooltipRef.current)

      const dataExtent = extent(formattedData, (d) => d.diff)
      const days = chartData.map((d) => d.day)

      const yScale = scaleLinear()
        .domain([dataExtent[0] < 0 ? dataExtent[0] : 0, dataExtent[1]])
        .range([height - margin.bottom, margin.top])
      const xScale = scalePoint()
        .domain(days)
        .range([margin.left, width - margin.right])

      drawChart(svg, chartData, margin, width, timeFrame, xScale, yScale)
      drawTooltip(
        svg,
        chartData,
        xScale,
        yScale,
        margin,
        width,
        tooltip,
        tempScale
      )
    }
  }, [chartData, width, height, timeFrame, tempScale])

  return (
    <Container>
      <Header>
        <TtHeader>Global air temperature change from normal</TtHeader>
        {width <= 600 ? (
          <Dropdown timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        ) : (
          <ButtonSet timeFrame={timeFrame} setTimeFrame={setTimeFrame} />
        )}
      </Header>
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

          <Area color={mainColor} id="year-over-year-positive"></Area>
          <MainLine color="#999" id="secondary-line"></MainLine>
          <MainLine color={mainColor} id="chart-main-line"></MainLine>

          <Label x={0} y={height - margin.bottom} className="axis-label">
            Baseline 1979 - 2000
          </Label>

          <Label color={mainColor} x={0} className="y-axis-label">
            2023
          </Label>

          <Label color="#999" x={0} className="y-axis-label">
            2022
          </Label>
          {[1, 0.5].map((d) => (
            <Label
              key={d}
              x={width - margin.right - 40}
              className="grid-line-label"
            >
              +{tempScale === "Farenheit" ? `${d} F` : `${FtoCdelta(d)} C`}
            </Label>
          ))}

          <g
            transform={`translate(0, ${height - margin.bottom})`}
            color="#FFF"
            id="x-axis"
          ></g>
        </svg>
        <Tooltip ref={tooltipRef} id="tooltip">
          <p className="temp"></p>
          <p className="temp-diff"></p>
        </Tooltip>
      </ChartWrapper>
    </Container>
  )
}

export default LineChart
