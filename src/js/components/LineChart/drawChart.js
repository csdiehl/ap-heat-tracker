import { line, area } from "d3-shape"
import { axisBottom } from "d3-axis"

export default function drawChart(
  svg,
  chartData,
  margin,
  width,
  timeFrame,
  xScale,
  yScale
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
