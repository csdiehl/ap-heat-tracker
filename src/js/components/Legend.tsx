import React from "react"
import styled from "styled-components"
import SizeLegend from "./SizeLegend"
import { CardBackground } from "./mixins"
import { LabelRegular, TtHeader, breakpoints, colors } from "./settings"
import Toggle from "./Switch"

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
interface LegendProps {
  activeLayers: string[]
  setActiveLayers: any
}

const Legend = ({ setActiveLayers, activeLayers }: LegendProps) => {
  const LayerSelect = (layer: string, label: string): React.ReactNode => {
    return (
      <>
        <img
          src={`./heat_tracker_${layer}.png`}
          style={{
            borderRadius: "5px",
            boxShadow: "0 0 5px #121212",
          }}
          width="32px"
          height="32px"
        ></img>
        <div>
          <LabelRegular style={{ marginBottom: "8px" }}>{label}</LabelRegular>
          <Toggle
            setLayer={() =>
              setActiveLayers((prev: string[]) =>
                prev.includes(layer)
                  ? prev.filter((d) => d !== layer)
                  : [...prev, layer]
              )
            }
            checked={activeLayers.includes(layer)}
          />
        </div>
      </>
    )
  }

  return (
    <Container>
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ maxWidth: "300px" }}>
          <TtHeader style={{ marginBottom: "8px" }}>
            Change from 1991-2020 normal
          </TtHeader>
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
        {LayerSelect("raster", "2-meter air temperature")}
        {LayerSelect("point", "Weather station reading")}
      </div>
    </Container>
  )
}

export default Legend
