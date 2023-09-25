import React from "react"
import * as Switch from "@radix-ui/react-switch"
import styled from "styled-components"

const red = "red"

interface props {
  setLayer: () => void
  checked: boolean
}

const Thumb = styled(Switch.Thumb)<{ checked: boolean }>`
  display: block;
  width: 16px;
  height: 16px;
  background-color: lightgrey;
  border-radius: 9999px;
  box-shadow: 0 2px 2px var(--blackA7);
  transition: transform 100ms;
  will-change: transform;
  transform: translate3d(${(props) => (props.checked ? 12 : -6)}px, -2px, 0);
`

const Root = styled(Switch.Root)<{ checked: boolean }>`
  width: 32px;
  height: 16px;
  background: ${(props) =>
    props.checked ? `linear-gradient(to right,#121212, ${red})` : "#121212"};
  border: 1px solid #121212;
  border-radius: 9999px;
  position: relative;
  box-shadow: 0 2px 10px var(--blackA7);
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  cursor: pointer;
`

const Toggle = ({ setLayer, checked }: props) => (
  <form>
    <div style={{ display: "flex", alignItems: "center" }}>
      <Root
        onCheckedChange={setLayer}
        checked={checked}
        className="SwitchRoot"
        id="airplane-mode"
      >
        <Thumb checked={checked} className="SwitchThumb" />
      </Root>
    </div>
  </form>
)

export default Toggle
