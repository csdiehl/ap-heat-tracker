import React from "react"
import {
  Root,
  Portal,
  Content,
  RadioGroup,
  RadioItem,
  Trigger,
} from "@radix-ui/react-dropdown-menu"
import styled from "styled-components"

const StyledContent = styled(Content)`
  z-index: 3;
  cursor: pointer;
  background: #181818;
  color: #fff;
  padding: 8px;
`

const Button = styled.button`
  all: unset;
  cursor: pointer;
  color: #fff;
  background-color: #181818;
  border-radius: 5px;
  padding: 2px 8px;
  font-size: 0.75rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
`

const timePeriods = ["year", "6_months", "3_months", "1_month"]

const Dropdown = ({ timeFrame, setTimeFrame }) => {
  return (
    <Root>
      <Trigger asChild>
        <Button className="IconButton" aria-label="Customise options">
          {timeFrame.replace("_", " ")}
        </Button>
      </Trigger>

      <Portal>
        <StyledContent className="DropdownMenuContent" sideOffset={5}>
          <RadioGroup value={timeFrame} onValueChange={setTimeFrame}>
            {timePeriods.map((d) => (
              <RadioItem key={d} value={d} on className="DropdownMenuItem">
                {d}
              </RadioItem>
            ))}
          </RadioGroup>
        </StyledContent>
      </Portal>
    </Root>
  )
}

export default Dropdown
