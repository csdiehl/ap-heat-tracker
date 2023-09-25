import maplibre from "maplibre-gl"
import { MapLayerMouseEvent } from "mapbox-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import React, { useRef, useState } from "react"
import Map, {
  Layer,
  MapRef,
  NavigationControl,
  Popup,
  Source,
} from "react-map-gl"
import { cities, clusteredCities, heatTiles } from "./MapStyles"
import { initialViewState, styleEnum, thisMonth, tilesLink } from "./settings"
import FormattedPopup from "./FormattedPopup"
import { TempScale } from "../types"

interface MapProps {
  data: any
  tempScale: TempScale
  activeLayers: string[]
}

function BaseMap({ data, tempScale, activeLayers }: MapProps) {
  const mapRef = useRef<MapRef>()
  const [popupInfo, setPopupInfo] = useState(null)
  // const latestTemp = stations && stations[stations.length - 1]

  function handleMapHover(event: MapLayerMouseEvent) {
    if (!event?.features || event.features.length === 0) return
    const data = event?.features[0]?.properties
    if (data?.diff && event?.features[0]?.geometry?.type === "Point") {
      const coords = event?.features[0]?.geometry?.coordinates ?? []
      setPopupInfo({ ...data, lon: coords[0], lat: coords[1] })
    }
  }

  function handleMapClick(event: MapLayerMouseEvent) {
    if (!event?.features || event.features.length === 0) return
    const feature = event.features[0]

    if (feature) {
      const layer = feature.layer.id

      if (layer === "clusters" && feature?.geometry?.type === "Point") {
        const { current: map } = mapRef
        map.flyTo({
          center: feature.geometry.coordinates as [number, number],
          zoom: 6,
          essential: true,
        })
      }
    }
  }

  return (
    <>
      <Map
        minZoom={1.5}
        maxBounds={[
          [-179, -85], // Southwest coordinates
          [179, 85], // Northeast coordinates
        ]}
        mapLib={maplibre}
        attributionControl={false}
        ref={mapRef}
        initialViewState={initialViewState}
        onClick={handleMapClick}
        onMouseMove={handleMapHover}
        onMouseLeave={() => setPopupInfo(null)}
        interactiveLayerIds={["cities", "clusters"]}
        mapStyle={`https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${styleEnum}?type=style&token=AAPK607d6ebb8ce04a1a9fc5e06c1b80cf4aoVSN2GntWaa8EnGF8MNnFz_3vax7S1HODpwDAlFvelNGDk8JIFYk_Db6OH9ccx-T`}
      >
        <Source
          id="heat-tiles-data"
          type="raster"
          tileSize={512}
          tiles={[tilesLink]}
          scheme="tms"
          minzoom={0}
          maxzoom={4}
        >
          <Layer
            layout={{
              visibility: activeLayers.includes("raster") ? "visible" : "none",
            }}
            minzoom={0}
            maxzoom={4}
            {...heatTiles}
          />
        </Source>
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
          <Layer
            layout={{
              visibility: activeLayers.includes("point") ? "visible" : "none",
            }}
            {...cities}
          ></Layer>
          <Layer
            layout={{
              visibility: activeLayers.includes("point") ? "visible" : "none",
            }}
            {...clusteredCities}
          ></Layer>
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
