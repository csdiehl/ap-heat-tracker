import React from "react"
import { Button } from "./styles"

const timePeriods = ["year", "6_months", "3_months", "1_month"]

interface Props {
  timeFrame: string
  setTimeFrame: (time: string) => void
}

const ButtonSet = ({ timeFrame, setTimeFrame }: Props) => {
  return (
    <div>
      {timePeriods.map((d) => (
        <Button
          active={d === timeFrame}
          key={d}
          onClick={() => setTimeFrame(d)}
        >
          {d.replace("_", " ")}
        </Button>
      ))}
    </div>
  )
}

export default ButtonSet
