import styled from "styled-components"
import { typography } from "@apdata/core"

export const initialViewState = {
  latitude: 30.7751,
  longitude: 0,
  zoom: 1.5,
  bearing: 0,
  pitch: 0,
}

export const colors = [
  "#CCEEF9",
  "#00ABE2",
  "#006788",
  "#C47A0A",
  "#F9C16D",
  "#FBD69E",
  "#FDEACE",
  "#F9ADB3",
]

export function colorScale(temp) {
  switch (true) {
    case temp <= -10:
      return colors[0]
    case temp <= -5:
      return colors[1]
    case temp <= 0:
      return colors[2]
    case temp <= 2:
      return colors[3]
    case temp <= 4:
      return colors[4]
    case temp <= 6:
      return colors[5]
    case temp <= 8:
      return colors[6]
    case temp > 8:
      return colors[7]
    default:
      return "#FFF"
  }
}

export const neutralGrey = "rgb(29, 34, 36)"

export const citySizes = [2, 5, 10, 15]

export const styleEnum = "c11ce4f7801740b2905eb03ddc963ac8"

//  "42410a35dc9445eeb65d10da1a5f62f0"

export const citiesLink =
  "https://s3.amazonaws.com/data.ap.org/projects/2023/cfs/data/processed/cities_stations.json"

export const tempsLink =
  "https://s3.amazonaws.com/data.ap.org/projects/2023/cfs/data/processed/latest_station_temps.json"

// design system styles
export const Heading2 = styled(typography.Heading2)`
  margin: 0;
  color: #fff;
`

export const Heading4 = styled(typography.Heading4)`
  margin: 0;
  color: lightgrey;
`

export const SmallCaps = styled(typography.SmallCaps)`
  margin: 4px 0px;
  color: #fff;
`

export const LabelBold = styled.p`
  margin: 0;
  color: #fff;
  ${typography.gfxLabelRegularStyles}
`

export const LabelRegular = styled.p`
  margin: 0;
  color: lightgrey;
  ${typography.gfxLabelSubtleStyles}
`

export const SVGLabel = styled.text`
  margin: 0;
  fill: lightgrey;
  ${typography.gfxLabelSubtleStyles}
`

export const SubHeading = styled.h3`
  color: #fff;
  font-family: AP Var;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.25rem;
  margin: 0px 0px 5px;
`

export const Text = styled.h4`
  color: lightgrey;
  font-family: AP Var;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
  margin: 5px 0px 0px;
`

export const thisMonth = new Date().toLocaleString("default", { month: "long" })

export const breakpoints = {
  mobile: "max-width: 425px",
  tablet: "max-width: 768px",
  desktop: "max-width: 1024px",
}
