import React, { useRef, useState } from "react"
import Map from "react-map-gl/maplibre"

const initialViewState = {
  latitude: 37.7751,
  longitude: -122.4193,
  zoom: 11,
  bearing: 0,
  pitch: 0,
}

const styleEnum = "ef0fe5a4221944c090fb642fa80c83e7"

async function tempAtStation(id) {
  if (!id) return "no stations within 5 miles"
  const res = await fetch(
    `https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&dataTypes=TMIN,TMAX,TOBS&stations=${id}&startDate=2023-07-27&endDate=2023-08-02&format=json&includeStationName=true&units=standard`
  )

  const data = await res.json()
  return data
}

function BaseMap() {
  const mapRef = useRef()
  const [stations, setStations] = useState(null)

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

  console.log(stations)

  return (
    <>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        onClick={handleMapClick}
        mapStyle={`https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${styleEnum}?type=style&token=AAPK607d6ebb8ce04a1a9fc5e06c1b80cf4aoVSN2GntWaa8EnGF8MNnFz_3vax7S1HODpwDAlFvelNGDk8JIFYk_Db6OH9ccx-T`}
      />
    </>
  )
}

export default BaseMap
