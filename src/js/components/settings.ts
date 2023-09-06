import styled from "styled-components"
import { typography } from "@apdata/core"
import { red } from "@apdata/core/colors"

export const initialViewState = {
  latitude: 30.7751,
  longitude: 0,
  zoom: 1.5,
  bearing: 0,
  pitch: 0,
}

export const colors = [
  "#121212",
  ...Object.entries(red)
    .slice(0, 7)
    .map((d) => d[1])
    .reverse() // change this to go back to dark - light
    .slice(0, 5),
]

export function colorScale(temp: number): string {
  switch (true) {
    case temp <= 0:
      return colors[0]
    case temp <= 2:
      return colors[1]
    case temp <= 4:
      return colors[2]
    case temp <= 6:
      return colors[3]
    case temp <= 8:
      return colors[4]
    case temp > 8:
      return colors[5]
    default:
      return colors[0]
  }
}

export const neutralGrey = "rgb(29, 34, 36)"

export const citySizes = [2, 4, 8, 16]

export const styleEnum = "c11ce4f7801740b2905eb03ddc963ac8"

//  "42410a35dc9445eeb65d10da1a5f62f0"

const S3 =
  "https://s3.amazonaws.com/data.ap.org/projects/2023/cfs/data/processed/"

export const citiesLink = `${S3}cities_stations_8.30.json`

export const tempsLink = `${S3}latest_station_temps.json`

export const tilesLink = `${S3}current_cfs/tiles/{z}/{x}/{y}.png`

// design system styles
export const Heading2 = styled(typography.Heading2)`
  margin: 0;
  color: #fff;
`

export const Heading3 = styled(typography.Heading3)``

export const Heading4 = styled(typography.Heading4)`
  margin: 0;
  color: lightgrey;
`

export const SmallCaps = styled(typography.SmallCaps)`
  margin: 4px 0px;
  color: #fff;
`

export const TtHeader = styled.h3`
  ${typography.ttHeaderStyles}
  margin: 4px 0px;
  color: #fff;

  @media (max-width: 425px) {
    font-size: 0.75rem;
    line-height: 1rem;
  }
`

export const Note = styled.p`
  ${typography.ttLabelStyles}
`

export const BodyText = styled(typography.Body)``

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

export const thisMonth = new Date().toLocaleString("default", {
  month: "long",
})

export const breakpoints = {
  mobile: "max-width: 425px",
  tablet: "max-width: 768px",
  desktop: "max-width: 1024px",
}
