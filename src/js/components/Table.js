import React from "react"
import styled from "styled-components"
import { Text } from "./settings"
import { CardBackground, AbsolutePos } from "./mixins"

const Container = styled.div`
  top: 108px;
  left: 16px;
  color: #fff;
  ${AbsolutePos}
  ${CardBackground}
`

const Card = styled.div`
  display: flex;
  gap: 8px;
`

const Table = ({ data }) => {
  return (
    <Container>
      {data.map((d) => (
        <Card key={d.code}>
          <Text>+{d.diff.toFixed(1)}℉</Text>
          <Text>
            <strong>{d.city}</strong>, {d.country}
          </Text>
        </Card>
      ))}
    </Container>
  )
}

export default Table
