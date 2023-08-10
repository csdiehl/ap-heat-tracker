import React, { useState, useRef, useEffect } from "react"
import BaseMap from "../../components/Map"
import Legend from "../../components/Legend"
import styled from "styled-components"
import { Title, Text, citiesLink, tempsLink } from "../../components/settings"
import Tooltip from "../../components/Tooltip"
import Table from "../../components/Table"
import { CardBackground, AbsolutePos } from "../../components/mixins"

const Container = styled.div`
  height: 700px;
  width: 100%;
  position: relative;
`

const InfoBox = styled.div`
  ${AbsolutePos}
  top: 16px;
  left: 16px;
  ${CardBackground}
`
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

const dataForTable = (data) =>
  data?.features &&
  data.features
    .sort((a, b) => b.properties.diff - a.properties.diff)
    .slice(0, 10)
    .map((d) => d.properties)

function HeatTracker() {
  const [date, setDate] = useState([0, 0])
  const containerRef = useRef()
  const [data, setData] = useState(null)

  useEffect(() => {
    async function joinTempsToCities() {
      const res1 = await fetch(citiesLink)
      const cities = await res1.json()
      const res2 = await fetch(tempsLink)
      const temps = await res2.json()

      cities.features.forEach((city) => {
        const temp = temps.find(
          (x) =>
            x.city + x.code === city?.properties?.city + city?.properties?.code
        )

        city.properties.diff = temp.diff
      })

      const sorted = temps
        .filter((d) => d?.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
      const firstDate = sorted[0]?.date,
        lastDate = sorted.at(-1)?.date

      setData(cities)
      setDate([lastDate, firstDate])
    }

    joinTempsToCities()
  }, [setDate])

  console.log(dataForTable(data))

  return (
    <Container ref={containerRef}>
      {data && <Table data={dataForTable(data)} />}
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
      <BaseMap data={data} />
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
