import maplibre from "maplibre-gl"
import { MapLayerMouseEvent } from "mapbox-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import React, { useRef, useState } from "react"
import Map, { Layer, NavigationControl, Popup, Source } from "react-map-gl"
import { cities, clusterCounts, clusteredCities } from "./MapStyles"
import { initialViewState, styleEnum, thisMonth } from "./settings"
import FormattedPopup from "./FormattedPopup"
import { TempScale } from "../types"

interface MapProps {
  data: any
  tempScale: TempScale
}

function BaseMap({ data, tempScale }: MapProps) {
  const mapRef = useRef()
  const [popupInfo, setPopupInfo] = useState(null)
  // const latestTemp = stations && stations[stations.length - 1]

  function handleMapClick(event: MapLayerMouseEvent) {
    if (!event?.features || event.features.length === 0) return
    const data = event?.features[0]?.properties
    if (data?.diff && event?.features[0]?.geometry?.type === "Point") {
      const coords = event?.features[0]?.geometry?.coordinates ?? []
      setPopupInfo({ ...data, lon: coords[0], lat: coords[1] })
    }
  }

  return (
    <>
      <Map
        style={{ gridArea: "map" }}
        mapLib={maplibre}
        attributionControl={false}
        ref={mapRef}
        initialViewState={initialViewState}
        onMouseMove={handleMapClick}
        onMouseLeave={() => setPopupInfo(null)}
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
        <NavigationControl
          style={{ backgroundColor: "lightgrey" }}
          position="top-right"
        />
      </Map>
    </>
  )
}

export default BaseMap
