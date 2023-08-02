import {
  render,
  compose,
  withFeaturePageView as withPageView,
  withResizeMessage,
  withHashProps
} from 'ap-interactives-plumbing'
import C from '<%= importPath %>'
import 'scss/fonts.scss'

const enhance = compose(
  withPageView(GOOGLE_ANALYTICS_ID, { env: NODE_ENV }),
  withHashProps(),
  withResizeMessage(({ dwid }) => ({ dwid }))
)
const Component = enhance(C)

const selector = 'div.ap-interactive[data-interactive="heat-tracker"][data-entrypoint="<%= name %>"]'
const nodes = document.querySelectorAll(selector)

if (window.__HTML_WEBPACK_JSDOM_PRERENDER_PLUGIN__) {
  const [content, headContent] = render.ssr(Component)({})
  nodes.forEach(node => { node.innerHTML = content })
  document.head.innerHTML += headContent || ''
} else {
  nodes.forEach(node => render.renderOrHydrate(Component, node))
}
