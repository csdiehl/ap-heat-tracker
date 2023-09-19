import React, { SetStateAction } from "react"
import styled from "styled-components"
import SizeLegend from "./SizeLegend"
import { CardBackground } from "./mixins"
import { LabelRegular, TtHeader, breakpoints, colors } from "./settings"

const Container = styled.div`
  ${CardBackground}

  @media (${breakpoints.mobile}) {
    bottom: 0;
    left: 0;
    width: 100%;
  }
`

const Colors = styled.div`
  display: flex;
  gap: 4px;
  height: 16px;
`

const Patch = styled.div`
  width: 16px;
  height: 100%;
  background-color: ${(props) => props.color};
  border-radius: 2px;
`

const Legend = ({ setActiveLayers }: { setActiveLayers: any }) => {
  return (
    <Container>
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ maxWidth: "200px" }}>
          <TtHeader>Difference from 1991-2020 Normal</TtHeader>
          <Colors>
            {colors.map((c) => (
              <Patch key={c} color={c}></Patch>
            ))}
          </Colors>
          <LabelRegular style={{ margin: "4px 0px" }}>
            Neutral → Warmer
          </LabelRegular>
        </div>
        <SizeLegend />
      </div>
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <img
          src="./heat_tracker_raster.png"
          style={{
            borderRadius: "5px",
            boxShadow: "0 0 5px #121212",
            cursor: "pointer",
          }}
          width="32px"
          height="32px"
          onClick={() =>
            setActiveLayers((prev: string[]) =>
              prev.includes("raster")
                ? prev.filter((d) => d !== "raster")
                : [...prev, "raster"]
            )
          }
        ></img>
        <LabelRegular>2-meter air temperature</LabelRegular>
        <img
          src="./heat_tracker_cities.png"
          style={{
            borderRadius: "5px",
            boxShadow: "0 0 5px #121212",
            cursor: "pointer",
          }}
          width="32px"
          height="32px"
          onClick={() =>
            setActiveLayers((prev: string[]) =>
              prev.includes("point")
                ? prev.filter((d) => d !== "point")
                : [...prev, "point"]
            )
          }
        ></img>
        <LabelRegular>Weather Station data</LabelRegular>
      </div>
    </Container>
  )
}

export default Legend
