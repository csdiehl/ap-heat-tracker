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
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

const findDateExtent = (data) => {
  const sorted = data
    .filter((d) => d?.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  const firstDate = sorted[0]?.date,
    lastDate = sorted.at(-1)?.date

  return [firstDate, lastDate]
}

const joinTemperatures = (cities, temps) => {
  cities.features.forEach((city) => {
    const temp = temps.find(
      (x) => x.city + x.code === city?.properties?.city + city?.properties?.code
    )

    city.properties.diff = temp?.diff ?? 0
  })
}

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
  const [selectedCity, setSelectedCity] = useState(null)

  // remove cities with no data
  const filteredData = data && {
    ...data,
    features: data.features.filter((d) => d?.properties?.diff),
  }

  useEffect(() => {
    async function joinTempsToCities() {
      const res1 = await fetch(citiesLink)
      const cities = await res1.json()
      const res2 = await fetch(tempsLink)
      const temps = await res2.json()

      joinTemperatures(cities, temps)
      const [firstDate, lastDate] = findDateExtent(temps)

      const filteredCities = {
        ...cities,
        features: cities.features.filter((d) => d?.properties?.diff >= 0),
      }

      console.log(filteredCities)

      setData(filteredCities)
      setDate([lastDate, firstDate])
    }

    joinTempsToCities()
  }, [setDate])

  return (
    <Container ref={containerRef}>
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
