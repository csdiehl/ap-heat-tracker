import maplibre from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import React, { useRef, useState } from "react"
import Map, { Layer, NavigationControl, Popup, Source } from "react-map-gl"
import {
  cities,
  clusterCounts,
  clusteredCities,
  selectedCityLayer,
} from "./MapStyles"
import { initialViewState, styleEnum, thisMonth } from "./settings"
import { FtoC } from "./utils"
import FormattedPopup from "./FormattedPopup"

function BaseMap({ data, selectedCity, tempScale }) {
  const mapRef = useRef()
  const [popupInfo, setPopupInfo] = useState(null)
  // const latestTemp = stations && stations[stations.length - 1]

  function handleMapClick(event) {
    if (!event?.features || event.features.length === 0) return
    const data = event?.features[0]?.properties ?? null
    const coords = event?.features[0]?.geometry?.coordinates ?? []
    setPopupInfo({ ...data, lon: coords[0], lat: coords[1] })
  }

  console.log(popupInfo)

  return (
    <>
      <Map
        style={{ gridArea: "map" }}
        mapLib={maplibre}
        attributionControl={false}
        ref={mapRef}
        initialViewState={initialViewState}
        onClick={handleMapClick}
        interactiveLayerIds={["cities"]}
        mapStyle={`https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${styleEnum}?type=style&token=AAPK607d6ebb8ce04a1a9fc5e06c1b80cf4aoVSN2GntWaa8EnGF8MNnFz_3vax7S1HODpwDAlFvelNGDk8JIFYk_Db6OH9ccx-T`}
      >
        <Source
          id="city-data"
          type="geojson"
          data={data}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={20}
          clusterMinPoints={5}
          clusterProperties={{ "avg_diff": ["+", ["get", "diff"]] }}
        >
          <Layer {...cities}></Layer>
          <Layer {...clusteredCities}></Layer>
          <Layer {...clusterCounts}></Layer>
        </Source>
        {popupInfo && (
          <Popup
            longitude={Number(popupInfo.lon)}
            latitude={Number(popupInfo.lat)}
            anchor="bottom"
            onClose={() => setPopupInfo(false)}
          >
            <FormattedPopup
              info={popupInfo}
              scale={tempScale}
              month={thisMonth}
            />
          </Popup>
        )}
        <Layer
          source="city-data"
          {...selectedCityLayer}
          filter={["==", ["get", "city"], selectedCity]}
          layout={{ visibility: selectedCity ? "visible" : "none" }}
        ></Layer>
        <NavigationControl
          style={{ backgroundColor: "lightgrey" }}
          position="top-right"
        />
      </Map>
    </>
  )
}

export default BaseMap

/**
 * 
 * fetch temp on a click
 * 
 *    const { lng, lat } = event?.lngLat

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

      async function tempAtStation(id) {
  if (!id) return "no stations within 5 miles"
  const res = await fetch(
    `https://www.ncei.noaa.gov/access/services/data/v1?dataset=daily-summaries&dataTypes=TMIN,TMAX,TOBS&stations=${id}&startDate=2023-07-27&endDate=2023-08-02&format=json&includeStationName=true&units=standard`
  )

  const data = await res.json()
  return data
}
 */
