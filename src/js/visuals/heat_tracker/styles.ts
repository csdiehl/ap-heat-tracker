import styled, { keyframes } from "styled-components"
import { AbsolutePos } from "../../components/mixins"
import { neutralGrey } from "../../components/settings"

const totalHeight = "800px"

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  80% {
    transform: rotate(450deg) scale(1.1);
  }

  100% {
    transform: rotate(360deg) scale(1);
  }
`

export const Container = styled.div`
  padding: 8px;
  border-radius: 5px;
  height: ${totalHeight};
  width: 100%;
  position: relative;
  background: ${neutralGrey};
  box-sizing: border-box;
`

export const MapContainer = styled.div`
  position: relative;
  grid-area: map;
`

export const InfoBox = styled.div`
  ${AbsolutePos};
  top: 16px;
  left: 16px;
  grid-area: title;
  padding: 8px;
`

export const TempToggle = styled.button`
  all: unset;
  ${AbsolutePos};
  bottom: calc(200px - 24px);
  right: 16px;
  background: ${neutralGrey};
  border-radius: 50%;
  z-index: 3;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: bold;
  animation: ${spin} 500ms ease-in-out;
`
