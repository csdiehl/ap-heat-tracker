import React from "react"
import { TempScale, CityProperties, Month } from "../types"
import { FtoCdelta } from "./utils"
import styled from "styled-components"
import { colorScale, Note } from "./settings"

type PopupInfo = Pick<CityProperties, "city" | "diff" | "country">

interface Props {
  scale: TempScale
  info: PopupInfo
  month: string
}

const Highlight = styled.strong<{ diff: number }>`
  background-color: ${(props) => colorScale(props.diff)};
  border-radius: 5px;
  margin: 4px;
  padding: 4px;
  color: ${(props) => (props.diff >= 8 ? "#121212" : "#FFF")};
`

const FormattedPopup = ({ scale, info, month }: Props) => {
  const difference = Math.abs(info.diff)

  const temp =
    scale === "Farenheit"
      ? `${difference.toFixed(1)} F`
      : `${FtoCdelta(difference)} C`

  return (
    <Note>
      It is roughly <Highlight diff={info.diff}>{temp}</Highlight>{" "}
      {info.diff < 0 ? "colder" : "warmer"} in{" "}
      <strong style={{ textTransform: "capitalize" }}>
        {info.city}, {info.country}
      </strong>{" "}
      than the normal for <strong>{month}</strong>
    </Note>
  )
}

export default FormattedPopup
