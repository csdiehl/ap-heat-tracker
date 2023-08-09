import React from "react"
import { colors } from "./settings"
import styled from "styled-components"
import { SubHeading, Text } from "./settings"

const Container = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 1;
  width: 100%;
  max-width: 160px;
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 5px;
  box-sizing: border-box;
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
`

const Legend = () => {
  return (
    <Container>
      <SubHeading>Difference from Normal Temperature</SubHeading>
      <Colors>
        {colors.map((c) => (
          <Patch key={c} color={c}></Patch>
        ))}
      </Colors>
      <Text>Colder → Warmer</Text>
    </Container>
  )
}

export default Legend
