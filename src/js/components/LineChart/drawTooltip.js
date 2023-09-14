import { bisect, range } from "d3-array"
import { pointer } from "d3-selection"
import { CtoF } from "../utils"

// tooltip
export default function drawTooltip(
  svg,
  chartData,
  xScale,
  yScale,
  margin,
  width,
  tooltip,
  tempScale
) {
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
    .attr("y1", 125)

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

      const T = tooltipData?.temp ?? 0

      tooltip
        .select(".temp")
        .text(
          `${
            tempScale === "Farenheit"
              ? `${CtoF(T).toFixed(1)} F`
              : `${T.toFixed(1)} C`
          }`
        )
      tooltip.select(".temp-diff").text(`+${tooltipData?.diff}`)
    })
    .on("mouseleave", function () {
      tooltipDot.style("opacity", 0)
      toolTipLine.style("opacity", 0)
      tooltip.style("opacity", 0)
    })
}
