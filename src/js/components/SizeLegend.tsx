import React from "react"
import styled from "styled-components"
import { SubHeading } from "./settings"
import { citySizes } from "./settings"

const Label = styled.text`
  font-family: AP Var;
  font-size: 0.75rem;
  fill: #fff;
`

const fireSizes = new Map([
  [citySizes[3], "1M or more"],
  [citySizes[2], "100k to 1M"],
  [citySizes[1], "10k to 100k"],
  [citySizes[0], "0 to 10k"],
])

const SizeLegend = () => {
  return (
    <div>
      <SubHeading>City Population</SubHeading>
      <svg width={160} height={52}>
        {[...fireSizes.keys()].map((s, i) => (
          <g key={i}>
            <circle
              key={i}
              r={s}
              cx={26}
              cy={52 - s}
              fill="transparent"
              stroke="#FFF"
            ></circle>
            <Label x={50} y={22 + i * 14}>
              {fireSizes.get(s)}
            </Label>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default SizeLegend
