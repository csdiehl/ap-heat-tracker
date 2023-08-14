import React from "react"
import styled from "styled-components"
import { Text, breakpoints } from "./settings"
import { CardBackground, AbsolutePos } from "./mixins"

const Container = styled.div`
  top: 108px;
  left: 16px;
  color: #fff;
  ${AbsolutePos}
  ${CardBackground}

  @media(${breakpoints.mobile}) {
    left: 0;
  }
`

const Card = styled.div`
  display: flex;
  gap: 8px;
`

const Table = ({ data }) => {
  return (
    <Container>
      {data.map((d) => (
        <Card key={d.code + d.city}>
          <Text>+{d.diff.toFixed(1)} F</Text>
          <Text>
            <strong>{d.city}</strong>, {d.country}
          </Text>
        </Card>
      ))}
    </Container>
  )
}

export default Table
