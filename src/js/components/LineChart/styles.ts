import styled from "styled-components"
import { AbsolutePos, CardBackground } from "../mixins"

const Container = styled.div`
  ${AbsolutePos}
  ${CardBackground}
  bottom: 0;
  left: 0;
  height: 200px;
  width: 100%;
  max-width: 1300px;
  grid-area: chart;
  display: grid;
  grid-template-rows: 20px minmax(0, 1fr);
  grid-template-columns: 100%;

  @media (max-width: 425px) {
    padding-left: 4px;
    padding-right: 4px;
  }
`

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
`

const MainLine = styled.path`
  stroke: ${(props) => props.color ?? "#FFF"};
  stroke-width: ${(props) => props.width ?? 2};
  fill: none;
  stroke-line-join: round;
`

const Area = styled.path`
  fill: ${(props) => props.color};
  stroke: none;
  opacity: 0.2;
`

const BaseLine = styled.line`
  stroke: lightgrey;
  stroke-dasharray: 2 2;
`

const GridLine = styled.line`
  stroke: #181818;
  opacity: 0.5;
`

const Button = styled.button<{ active: boolean }>`
  all: unset;
  cursor: pointer;
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.2)" : "none"};
  border-radius: 5px;
  color: #fff;
  transition: background 200ms ease-in;
  font-size: 0.75rem;
  line-height: 0.75rem;
  font-weight: 500;
  padding: 8px;
`

const Label = styled.text`
  font-size: 0.75rem;
  font-weight: bold;
  fill: ${(props) => props.color ?? "white"};
  alignment-baseline: middle;
  stroke: black;
  paint-order: stroke fill;
`

const Header = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-start;
  align-items: center;

  @media (max-width: 425px) {
    gap: 8px;
    text-wrap: balance;
  }
`

const Tooltip = styled.div`
  position: absolute;
  color: #fff;
  background-color: rgba(18, 18, 18, 0.8);
  padding: 8px;
  border: rgb(20, 20, 20) solid grey;
  pointer-events: none;
  border-radius: 5px;

  > p {
    margin: 0;
    font-size: 0.75rem;
  }

  & p:first-child {
    font-weight: bold;
    font-size: 0.875rem;
  }
`

export {
  Label,
  ChartWrapper,
  Container,
  MainLine,
  Area,
  BaseLine,
  Button,
  GridLine,
  Header,
  Tooltip,
}
