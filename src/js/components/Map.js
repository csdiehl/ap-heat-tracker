import React, { useRef, useState, useEffect } from "react"
import Map, { Source, Layer } from "react-map-gl/maplibre"
import { cities } from "./MapStyles"
import { citiesLink, tempsLink, initialViewState, styleEnum } from "./settings"

async function tempAtStation(id) {
  if (!id) return "no stations within 5 miles"
  const res = await fetch(
    `https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&dataTypes=TMIN,TMAX,TOBS&stations=${id}&startDate=2023-07-27&endDate=2023-08-02&format=json&includeStationName=true&units=standard`
  )

  const data = await res.json()
  return data
}

function BaseMap({ setDate }) {
  const mapRef = useRef()
  const [stations, setStations] = useState(null)
  const [data, setData] = useState(null)
  // const latestTemp = stations && stations[stations.length - 1]

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
  }, [])

  function handleMapClick(event) {
    const { lng, lat } = event?.lngLat

    fetch(
      `https://gis.ncdc.noaa.gov/arcgis/rest/services/cdo/normals/MapServer/1/query?outFields=STATION_NAME, STATION_ID, ELEVATION&geometry=${lng},${lat}&spatialRel=esriSpatialRelIntersects&where=1=1&f=pjson&geometryType=esriGeometryPoint&returnGeometry=false&distance=5&units=esriSRUnit_StatuteMile`
    )
      .then((response) => response.json())
      .then((result) => {
        const id = result?.features[0]?.attributes?.STATION_ID.split(":")[1]
        console.log(id)
        tempAtStation(id).then((stationData) => setStations(stationData))
      })
      .catch((error) => console.log("error", error))
  }

  return (
    <>
      <Map
        attributionControl={false}
        ref={mapRef}
        initialViewState={initialViewState}
        onClick={handleMapClick}
        mapStyle={`https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${styleEnum}?type=style&token=AAPK607d6ebb8ce04a1a9fc5e06c1b80cf4aoVSN2GntWaa8EnGF8MNnFz_3vax7S1HODpwDAlFvelNGDk8JIFYk_Db6OH9ccx-T`}
      >
        <Source id="city-data" type="geojson" data={data}>
          <Layer {...cities}></Layer>
        </Source>
      </Map>
    </>
  )
}

export default BaseMap
