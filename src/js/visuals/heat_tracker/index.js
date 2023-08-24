import React, { useState, useRef, useEffect } from "react"
import BaseMap from "../../components/Map"
import Legend from "../../components/Legend"
import styled from "styled-components"
import {
  Title,
  Text,
  citiesLink,
  tempsLink,
  neutralGrey,
} from "../../components/settings"
import Tooltip from "../../components/Tooltip"
import Table from "../../components/Table"
import {
  formatDate,
  findDateExtent,
  joinTemperatures,
  dataForTable,
} from "../../components/utils"
import { AbsolutePos } from "../../components/mixins"

const Container = styled.div`
  padding: 8px;
  border-radius: 5px;
  height: 700px;
  width: 100%;
  position: relative;
  background: ${neutralGrey};
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "title map"
    "list map";
`

const InfoBox = styled.div`
  grid-area: title;
  padding: 8px;
`

const TempToggle = styled.button`
  all: unset;
  ${AbsolutePos};
  top: 16px;
  right: 50px;
  background: lightgrey;
  border-radius: 50%;
  z-index: 3;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
`

function HeatTracker() {
  const [date, setDate] = useState([0, 0])
  const containerRef = useRef()
  const [data, setData] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [tempScale, setTempScale] = useState("Farenheit")

  // remove cities with no data
  const filteredData = data && {
    ...data,
    features: data.features.filter((d) => d?.properties?.diff > 0),
  }

  useEffect(() => {
    async function joinTempsToCities() {
      const res1 = await fetch(citiesLink)
      const cities = await res1.json()
      const res2 = await fetch(tempsLink)
      const temps = await res2.json()

      joinTemperatures(cities, temps)
      const [firstDate, lastDate] = findDateExtent(temps)

      console.log(cities)

      setData(cities)
      setDate([lastDate, firstDate])
    }

    joinTempsToCities()
  }, [setDate])

  return (
    <Container ref={containerRef}>
      <TempToggle
        onClick={() =>
          setTempScale((prev) =>
            prev === "Farenheit" ? "Celcius" : "Farenheit"
          )
        }
      >
        C
      </TempToggle>
      {data && (
        <Table
          data={dataForTable(data)}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      )}
      <InfoBox>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gridArea: "title",
          }}
        >
          <Title>Extreme Heat Tracker</Title>
          <Tooltip boundary={containerRef.current} />
        </div>

        <Text>
          Updated with data from {formatDate(date[0])} to {formatDate(date[1])}{" "}
        </Text>
      </InfoBox>
      <Legend />
      <BaseMap
        tempScale={tempScale}
        selectedCity={selectedCity}
        style={{ gridArea: "map" }}
        data={filteredData}
      />
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
