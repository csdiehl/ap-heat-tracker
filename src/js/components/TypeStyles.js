import styled from "styled-components"

export const APFontFamily = '"AP Var", Arial, Helvetica, sans-serif'
const textColor = "#FFF"

export const boldLabelStyles = `
  font-family: ${APFontFamily};
  margin: 0;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1rem;
  font-stretch: 65%;
`
export const BoldLabel = styled.span`
  ${boldLabelStyles}
`

export const subtleLabelStyles = `
  font-family: ${APFontFamily};
  margin: 0;
  font-weight: 225;
  font-size: 0.75rem;
  line-height: 1rem;
  font-stretch: 65%;
`
export const SubtleLabel = styled.span`
  ${subtleLabelStyles}
`

export const legendSectionLabelStyles = `
  font-family: ${APFontFamily};
  margin: 0;
  font-weight: 425;
  font-size: 0.75rem;
  line-height: 0.875rem;
  font-stretch: 70%;
  text-transform: uppercase;
`
export const LegendSectionLabel = styled.span`
  ${legendSectionLabelStyles}
  color: ${textColor};
`

export const legendCategoryLabelStyles = `
  font-family: ${APFontFamily};
  font-weight: 345;
  font-size: 0.75rem;
  line-height: 0.875rem;
  font-stretch: 45%;
   color: ${textColor};
`
export const LegendCategoryLabel = styled.span`
  ${legendCategoryLabelStyles}
  color: ${textColor};
`

export const legendValueLabelStyles = `
  font-family: ${APFontFamily};
  font-weight: 145;
  font-size: 0.75rem;
  line-height: 0.875rem;
  font-stretch: 45%;
`
export const LegendValueLabel = styled.span`
  ${legendValueLabelStyles}
`

export const smallCapsStyles = `
  font-family: ${APFontFamily};
  font-weight: 425;
  font-size: 0.75rem;
  line-height: 0.875rem;
  font-stretch: 70%;
  text-transform: uppercase;
`
export const SmallCaps = styled.span`
  ${smallCapsStyles}
`

export const secondarySubheadStyles = `
  font-family: ${APFontFamily};
  font-weight: 308;
  font-size: 0.875rem;
  line-height: 1rem;
  font-stretch: 75%;
`
export const SecondarySubhead = styled.h3`
  ${secondarySubheadStyles}
`

export const subheadStyles = `
  font-family: ${APFontFamily};
  font-weight: 325;
  font-size: 1rem;
  line-height: 1.25rem;
  font-stretch: 1.25;
`
export const Subhead = styled.h2`
  ${subheadStyles}
`

export const heroSubheadStyles = `
  font-family: ${APFontFamily};
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-stretch: 75%;
`
export const HeroSubhead = styled.h3`
  ${heroSubheadStyles}
`

export const descriptionStyles = `
  font-family: ${APFontFamily};
  font-weight: 250;
  size: 1rem;
  line-height: 1.5rem;
  font-stretch: 90%;
`
export const Description = styled.div`
  ${descriptionStyles}
  color: ${textColor};
`

export const footerStyles = `
  font-family: "AP Italic";
  font-style: italic;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 300;
`
export const Footer = styled.div`
  ${footerStyles}
`
