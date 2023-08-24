import React from "react"
import { SmallCaps, SVGLabel } from "./settings"
import { citySizes } from "./settings"

const fireSizes = new Map([
  [citySizes[3], "1M or more"],
  [citySizes[2], "100k to 1M"],
  [citySizes[1], "10k to 100k"],
  [citySizes[0], "0 to 10k"],
])

const SizeLegend = () => {
  return (
    <div>
      <SmallCaps>City Population</SmallCaps>
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
            <SVGLabel x={50} y={22 + i * 14}>
              {fireSizes.get(s)}
            </SVGLabel>
          </g>
        ))}
      </svg>
    </div>
  )
}

export default SizeLegend
