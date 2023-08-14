import * as Popover from "@radix-ui/react-popover"
import React from "react"
import styled, { keyframes } from "styled-components"
import { SubHeading } from "./settings"

const FadeIn = keyframes`
0% {
    opacity: 0;
}

100% {
    opacity: 1;
}
`

const Content = styled(Popover.Content)`
  border-radius: 4px;
  padding: 20px;
  width: 260px;
  background-color: #000;
  color: #fff;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation: ${FadeIn} 500ms;
  z-index: 5000;
  transform: translate3d(0, 0, 0);
`

const Button = styled.button`
  all: unset;
  cursor: pointer;
  display: flex;
  margin-top: 2px;
`

const Description = styled.p`
  font-family: AP Var;
  line-height: 16px;
  margin-bottom: 16px;
`

const content = (
  <>
    <SubHeading>How we calculated extreme heat</SubHeading>
    <Description>
      This temperature data comes from NOAA's National Center for Environmental
      Information (NCEI). We started with a list of 1,000 major cities, and
      matched each city with its nearest World Meteorological Organization
      weather station. We only matched with stations that provide both daily
      updates and long-term normal temperatures with at least 20 years of data.
      If a city did not have a valid station within 5 miles, we removed it from
      the dataset. Some cities in close proximity share the same station.
    </Description>
    <Description>
      We retrieved the latest daily average temperature from NCEI, which updates
      on a 3-5 day time lag. We subtracted the monthly normal temperature from
      that number to get the approximate difference from the month's usual
      reading. NOAA and WMO calculate normals over a 30-year period, from 1991
      to 2020, using a scientific formula that accounts for data outages.
    </Description>
  </>
)

const Tooltip = ({ boundary, openSide = "top" }) => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <Button aria-label="Information">
        <svg
          width="28"
          height="28"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z"
            fill="white"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </Button>
    </Popover.Trigger>
    <Popover.Portal>
      <Content
        avoidCollisions={true}
        collisionBoundary={boundary}
        sideOffset={5}
        side={openSide}
      >
        <div>{content}</div>
        <Popover.Arrow style={{ fill: "white" }} className="PopoverArrow" />
      </Content>
    </Popover.Portal>
  </Popover.Root>
)

export default Tooltip
