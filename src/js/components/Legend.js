import React from "react"
import { colors } from "./settings"
import styled from "styled-components"
import { SubHeading, Text } from "./settings"
import SizeLegend from "./SizeLegend"
import { CardBackground, AbsolutePos } from "./mixins"

const Container = styled.div`
  bottom: 16px;
  left: 16px;
  ${AbsolutePos}
  ${CardBackground}
  display: flex;
  gap: 16px;
`

const Colors = styled.div`
  display: flex;
  gap: 4px;
  height: 16px;
`

const Patch = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.color};
  border-radius: 2px;
`

const Legend = () => {
  return (
    <Container>
      <div style={{ maxWidth: "200px" }}>
        <SubHeading>Difference from Normal Temperature</SubHeading>
        <Colors>
          {colors.map((c) => (
            <Patch key={c} color={c}></Patch>
          ))}
        </Colors>
        <Text>Colder → Warmer</Text>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <Patch style={{ width: "16px", height: "16px" }} color="#000" />
          <Text>No Data</Text>
        </div>
      </div>
      <SizeLegend />
    </Container>
  )
}

export default Legend
