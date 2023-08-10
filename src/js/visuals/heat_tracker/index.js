import React, { useState, useRef } from "react"
import BaseMap from "../../components/Map"
import Legend from "../../components/Legend"
import styled from "styled-components"
import { Title, Text } from "../../components/settings"
import Tooltip from "../../components/Tooltip"

const Container = styled.div`
  height: 700px;
  width: 100%;
  position: relative;
`

const InfoBox = styled.div`
  position: absolute;
  z-index: 1;
  top: 16px;
  left: 16px;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 5px;
  box-sizing: border-box;
`
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

function HeatTracker() {
  const [date, setDate] = useState([0, 0])
  const containerRef = useRef()
  return (
    <Container ref={containerRef}>
      <InfoBox>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Title>Extreme Heat Tracker</Title>
          <Tooltip boundary={containerRef.current} />
        </div>

        <Text>
          Updated with data from {formatDate(date[0])} to {formatDate(date[1])}{" "}
        </Text>
      </InfoBox>
      <Legend />
      <BaseMap setDate={setDate} />
    </Container>
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
