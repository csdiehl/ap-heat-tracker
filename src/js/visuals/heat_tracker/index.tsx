import React, { useEffect, useRef, useState } from "react"
import Legend from "../../components/Legend"
import BaseMap from "../../components/Map"
import Tooltip from "../../components/Tooltip"
import {
  Heading2,
  Heading4,
  citiesLink,
  tempsLink,
} from "../../components/settings"
import {
  findDateExtent,
  formatDate,
  joinTemperatures,
} from "../../components/utils"
import { Container, InfoBox, TempToggle, MapContainer } from "./styles"
import { TempScale } from "../../types"
import { useData } from "ap-react-hooks"
import LineChart from "../../components/LineChart"

function HeatTracker() {
  const [date, setDate] = useState<[string, string]>(["", ""])
  const containerRef = useRef()
  const [data, setData] = useState(null)
  const [tempScale, setTempScale] = useState<TempScale>("Farenheit")
  const lineChartData = useData(
    "https://climatereanalyzer.org/clim/t2_daily/json/cfsr_world_t2_day.json"
  )

  // remove cities with no data
  const filteredData = data && {
    ...data,
    features: data.features.filter((d: any) => d?.properties?.diff),
  }

  useEffect(() => {
    async function joinTempsToCities() {
      const res1 = await fetch(citiesLink)
      const cities = await res1.json()
      const res2 = await fetch(tempsLink)
      const temps = await res2.json()

      joinTemperatures(cities, temps)
      const [firstDate, lastDate] = findDateExtent(temps)
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
          setTempScale(
            (prev: TempScale): TempScale =>
              prev === "Farenheit" ? "Celsius" : "Farenheit"
          )
        }
      >
        {tempScale === "Farenheit" ? "F" : "C"}
      </TempToggle>

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
      <BaseMap tempScale={tempScale} data={filteredData}></BaseMap>
      <Legend />

      <LineChart data={lineChartData} />
    </Container>
  )
}

HeatTracker.visual = {
  headline: "Heat Tracker",
  chatter: "",
  footerProps: { credit: "AP Data Team" },
}

export default HeatTracker
