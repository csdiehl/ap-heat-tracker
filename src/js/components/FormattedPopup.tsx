import React from "react"
import { TempScale, CityProperties, Month } from "../types"
import { FtoCdelta } from "./utils"

type PopupInfo = Pick<CityProperties, "city" | "diff" | "country">

interface Props {
  scale: TempScale
  info: PopupInfo
  month: string
}

const FormattedPopup = ({ scale, info, month }: Props) => {
  const difference = Math.abs(info.diff)

  const temp =
    scale === "Farenheit" ? `${difference} F` : `${FtoCdelta(difference)} C`

  return (
    <p>
      It is roughly <strong>{temp}</strong>{" "}
      {info.diff < 0 ? "colder" : "warmer"} in{" "}
      <strong style={{ textTransform: "capitalize" }}>
        {info.city}, {info.country}
      </strong>{" "}
      than the normal for <strong>{month}</strong>
    </p>
  )
}

export default FormattedPopup
