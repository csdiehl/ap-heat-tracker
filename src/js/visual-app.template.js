import React from 'react'
import {
  render,
  compose,
  withFeaturePageView as withPageView,
  withResizeMessage,
  withHashProps
} from 'ap-interactives-plumbing'
import { Interactive, Headline, Chatter, Footer } from 'ap-react-components'
import C from '<%= importPath %>'
import apLogo from 'ap-interactive-assets/images/AP_LOGO_86x100.png'
import 'scss/fonts.scss'

function Visual(props) {
  const visual = C.visual || {}
  const visualProps = visual.props || {}
  return (
    <Interactive>
      {visual.headline && <Headline>{visual.headline}</Headline>}
      {visual.chatter && <Chatter>{visual.chatter}</Chatter>}
      <C {...props} {...visualProps} />
      <Footer logo={apLogo} {...(visual.footerProps || {})} />
    </Interactive>
  )
}

const enhance = compose(
  withPageView(GOOGLE_ANALYTICS_ID, { env: NODE_ENV }),
  withHashProps(),
  withResizeMessage(({ dwid }) => ({ dwid }))
)
const Component = enhance(Visual)

const selector = 'div.ap-interactive[data-interactive="heat-tracker"][data-entrypoint="<%= name %>"]'
const nodes = document.querySelectorAll(selector)

if (window.__HTML_WEBPACK_JSDOM_PRERENDER_PLUGIN__) {
  const [content, headContent] = render.ssr(Component)({})
  nodes.forEach(node => { node.innerHTML = content })
  document.head.innerHTML += headContent || ''
} else {
  nodes.forEach(node => render.renderOrHydrate(Component, node))
}
