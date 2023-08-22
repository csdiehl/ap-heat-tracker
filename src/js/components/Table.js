import React from "react"
import styled from "styled-components"
import { Text, breakpoints, colorScale } from "./settings"

const Container = styled.div`
  top: 108px;
  left: 16px;
  color: #fff;
  grid-area: list;
  padding: 8px;

  @media (${breakpoints.mobile}) {
    left: 0;
  }
`

const Card = styled.div`
  display: flex;
  gap: 8px;
  align-items: top;
  justify-content: space-between;
  margin: 8px 0px;
`

const Number = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: ${(props) => props.color};
`

const Plus = styled.span`
  font-size: 1rem;
  font-weight: 400;
`

const Table = ({ data }) => {
  return (
    <Container>
      {data.map((d) => (
        <Card key={d.code + d.city}>
          <Number color={colorScale(d.diff)}>
            <Plus>+</Plus>
            {d.diff.toFixed(1)}
            <Plus>F</Plus>
          </Number>
          <Text style={{ textAlign: "right" }}>
            <strong style={{ color: "#FFF" }}>{d.city}</strong>
            <br /> {d.country}
          </Text>
        </Card>
      ))}
    </Container>
  )
}

export default Table
