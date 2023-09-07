import React from "react"
import styled from "styled-components"
import SizeLegend from "./SizeLegend"
import { CardBackground } from "./mixins"
import { LabelRegular, TtHeader, breakpoints, colors } from "./settings"

const Container = styled.div`
  ${CardBackground}
  display: flex;
  gap: 16px;

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

const Legend = () => {
  return (
    <Container>
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
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
          }}
        ></div>
      </div>
      <SizeLegend />
    </Container>
  )
}

export default Legend
