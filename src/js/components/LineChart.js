import React, { useRef, useEffect } from "react"
import styled from "styled-components"
import { useNodeDimensions } from "ap-react-hooks"
import { scaleLinear, scalePoint } from "d3-scale"
import { extent } from "d3-array"
import { line } from "d3-shape"
import { select } from "d3-selection"

const Container = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1300px;
  background: none;
  grid-area: chart;
`

const LineChart = ({ data }) => {
  const svgRef = useRef()
  const [node, dimensions] = useNodeDimensions()
  const { width, height } = dimensions

  useEffect(() => {
    if (data) {
      const svg = select(svgRef.current)
      const thisYearData = data.find((d) => d?.name === "2023")?.data
      const dataExtent = extent(thisYearData)
      const years = [...thisYearData.keys()]

      const yScale = scaleLinear().domain(dataExtent).range([height, 0])
      const xScale = scalePoint().domain(years).range([0, width])

      const lineGenerator = line(
        (d, i) => xScale(i),
        (d) => yScale(d)
      )

      svg
        .append("path")
        .attr("d", lineGenerator(thisYearData))
        .attr("stroke", "#FFF")
        .attr("fill", "none")
    }
  }, [data, width, height])

  return (
    <Container ref={node}>
      <h2 style={{ color: "#FFF", margin: 0 }}>Line Chart</h2>
      <svg width={width} height={height} ref={svgRef}></svg>
    </Container>
  )
}

export default LineChart
