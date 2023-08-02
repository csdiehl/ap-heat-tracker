import React from 'react'
import { toSentence } from 'ap-react-utils'
import { Nav, Article, SeoHeadline, HeroTitle, Metadata, BodyText, Graphic, EndNotes, Footer } from 'tailor'
import apLogo from 'ap-interactive-assets/images/AP_LOGO_86x100.png'
import HeatTracker from 'js/visuals/heat_tracker'

const metadata = {
  title: "Heat Tracker",
  description: "",
  authors: [{"name":"Caleb Diehl"}],
  published: "2023-08-02T15:52:37.903Z",
}
const notes = [
  {
    title: 'Produced by',
    note: 'The AP Data Team',
  },
]

function Index() {
  return (
    <div>
      <Nav img={apLogo} dark />
      <Article>
        <SeoHeadline>{metadata.seoTitle || metadata.title}</SeoHeadline>
        <HeroTitle
          headline={{
            eyebrow: 'AP Explains',
            headline: metadata.title,
            dek: metadata.description,
            light: true,
          }}
          image={{
            src: `data:image/svg+xml;charset=UTF-8,%3Csvg width='2000' height='1400' version='1.1' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gradient' x1='1' x2='0' y1='0' y2='1'%3E%3Cstop stop-color='%2300caa0' offset='0%25' /%3E%3Cstop stop-color='%239198e5' offset='100%25' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='2000' height='1400' fill='url(%23gradient)' /%3E%3C/svg%3E%0A`,
            alt: 'Example gradient',
          }}
          bottom
         />
        <Metadata
          byline={`By ${toSentence(metadata.authors.map(a => a.name))}`}
          date={metadata.published}
        />
        <BodyText>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            viverra diam vel libero tristique venenatis. Curabitur vitae quam vel
            nibh suscipit efficitur. Vestibulum ante ipsum primis in faucibus
            orci luctus et ultrices posuere cubilia curae; Proin eu sapien in dui
            tristique fringilla. Fusce eget tellus a libero dignissim
            porta.
          </p>
        </BodyText>
        <Graphic wide>
          <HeatTracker />
        </Graphic>
        <BodyText>
          <p>
            <strong>Aliquam sed fringilla nunc.</strong> Duis dolor arcu,
            aliquet sed mollis eu, facilisis quis ante. Nullam mollis diam urna,
            at sollicitudin nulla pharetra at. Cras porta, purus et interdum
            sollicitudin, libero dolor laoreet dui, a ullamcorper magna ex quis
            magna. Maecenas sit amet elit at odio sollicitudin sollicitudin. In
            at tincidunt libero.
          </p>
        </BodyText>
        <EndNotes
          notes={notes}
        />
      </Article>
      <Footer dark />
    </div>
  )
}

Index.propTypes = {}

Index.defaultProps = {}

export default Index
