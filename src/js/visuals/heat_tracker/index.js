import React, { useState, useRef, useEffect } from "react"
import BaseMap from "../../components/Map"
import Legend from "../../components/Legend"
import {
  Text,
  citiesLink,
  tempsLink,
  Heading2,
  Heading4,
} from "../../components/settings"
import Tooltip from "../../components/Tooltip"
import Table from "../../components/Table"
import {
  formatDate,
  findDateExtent,
  joinTemperatures,
  dataForTable,
} from "../../components/utils"
import { Container, InfoBox, TempToggle } from "./styles"

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
        key={tempScale}
        onClick={() =>
          setTempScale((prev) =>
            prev === "Farenheit" ? "Celcius" : "Farenheit"
          )
        }
      >
        {tempScale === "Farenheit" ? "F" : "C"}
      </TempToggle>
      {data && (
        <Table
          data={dataForTable(data)}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          tempScale={tempScale}
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
          <Heading2>Extreme Heat Tracker</Heading2>
          <Tooltip boundary={containerRef.current} />
        </div>

        <Heading4>
          Updated with data from {formatDate(date[0])} to {formatDate(date[1])}{" "}
        </Heading4>
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
