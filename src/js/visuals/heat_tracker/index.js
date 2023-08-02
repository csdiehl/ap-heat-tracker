import React from 'react'

function HeatTracker() {
  return (
    <div style={{ paddingBottom: '50%', background: 'linear-gradient(20deg, #9198e5, #00caa0)' }} />
  )
}

HeatTracker.visual = {
  headline: "Heat Tracker",
  chatter: "",
  footerProps: { credit: 'AP Data Team' },
}

HeatTracker.propTypes = {}

HeatTracker.defaultProps = {}

export default HeatTracker
