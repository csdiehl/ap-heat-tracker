import React from "react"
import BaseMap from "../../components/Map"

function HeatTracker() {
  return (
    <div style={{ height: "700px", width: "100%" }}>
      <BaseMap />
    </div>
  )
}

HeatTracker.visual = {
  headline: "Heat Tracker",
  chatter: "",
  footerProps: { credit: "AP Data Team" },
}

HeatTracker.propTypes = {}

HeatTracker.defaultProps = {}

export default HeatTracker
