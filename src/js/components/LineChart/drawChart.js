import { line, area } from "d3-shape"
import { axisBottom } from "d3-axis"
import { pointer } from "d3-selection"
import { range, bisect } from "d3-array"

export default function drawChart(
  svg,
  chartData,
  margin,
  width,
  timeFrame,
  xScale,
  yScale,
  tooltip
) {
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
    width <= 425
      ? 40
      : timeFrame === "year"
      ? 20
      : timeFrame === "6_months"
      ? 10
      : 5
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

  // tooltip
  function scalePointPosition(xPos) {
    const domain = xScale.domain()
    const xRange = xScale.range()
    const rangePoints = range(xRange[0], xRange[1], xScale.step()) // get an array of all possible points in the scale range
    // find the closest point in the array above to where the mouse pixel value is
    const idx = bisect(rangePoints, xPos) - 1
    const xValue = domain[idx] // get closest index, find point in domain at that index
    return [xValue, idx]
  }

  const tooltipDot = svg
    .append("circle")
    .attr("r", 5)
    .attr("fill", "#FFF")
    .style("pointer-events", "none")
    .style("opacity", 0)

  const toolTipLine = svg
    .append("line")
    .style("opacity", 0)
    .attr("stroke", "grey")
    .attr("y0", margin.top)
    .attr("y1", margin.top + 100)

  const tooltipText = svg
    .append("text")
    .attr("fill", "#FFF")
    .attr("text-anchor", "middle")
    .attr("stroke", "black")
    .attr("paint-order", "stroke fill")

  svg
    .append("rect")
    .attr("width", width)
    .attr("height", 180)
    .style("opacity", 0)
    .on("mousemove", function (event) {
      const [x, y] = pointer(event, this)

      const [xPosition, xIdx] = scalePointPosition(x)
      const tooltipData = chartData[xIdx] // only works if data are sorted!

      toolTipLine
        .style("opacity", 1)
        .attr("x1", xScale(xPosition))
        .attr("x2", xScale(xPosition))

      tooltipDot
        .style("opacity", 1)
        .attr("cx", xScale(xPosition))
        .attr("cy", yScale(tooltipData?.diff))
        .raise()

      tooltip
        .style("opacity", 1)
        .style("display", "block")
        .style("top", `${yScale(tooltipData?.diff) - 25}px`)
        .style("left", `${xScale(xPosition) - 10}px`)

      tooltip.select(".temp").text(`${tooltipData?.temp?.toFixed(1)}`)
      tooltip.select(".temp-diff").text(`+${tooltipData?.diff}`)
    })
    .on("mouseleave", function () {
      tooltipDot.style("opacity", 0)
      toolTipLine.style("opacity", 0)
      tooltip.style("opacity", 0)
    })
}
