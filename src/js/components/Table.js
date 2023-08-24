import React from "react"
import styled from "styled-components"
import { LabelBold, LabelRegular, breakpoints, colorScale } from "./settings"
import { FtoC, FtoCdelta } from "./utils"

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
  align-items: flex-start;
  justify-content: space-between;
  margin: 8px 0px;
  cursor: pointer;
  background: ${(props) =>
    props.clicked ? "rgba(255, 255, 255, .05)" : "none"};
`

const Number = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: ${(props) => props.color};
`

const Plus = styled.span`
  font-size: 1rem;
  font-weight: 400;
`

const Table = ({ data, setSelectedCity, selectedCity, tempScale }) => {
  console.log(data)
  return (
    <Container>
      {data.map((d) => (
        <Card
          clicked={d.city === selectedCity}
          onClick={() => setSelectedCity(d.city)}
          key={d.code + d.city}
        >
          <div>
            <Number color={colorScale(d.diff)}>
              <Plus>+</Plus>
              {tempScale === "Farenheit"
                ? d.diff.toFixed(1)
                : FtoCdelta(d.diff)}
              <Plus>{tempScale === "Farenheit" ? "F" : "C"}</Plus>
            </Number>
            <LabelRegular>
              {tempScale === "Farenheit" ? `${d.temp} F` : `${FtoC(d.temp)} C`}
            </LabelRegular>
          </div>

          <div>
            <LabelBold style={{ textAlign: "right" }}>
              {d.city.replace(/\(([^()]+)\)/, "")}
            </LabelBold>
            <LabelRegular style={{ textAlign: "right" }}>
              {d.country}
            </LabelRegular>
          </div>
        </Card>
      ))}
    </Container>
  )
}

export default Table
