import { toSentence } from "ap-react-utils"
import HeatTracker from "js/visuals/heat_tracker"
import React from "react"
import {
  Article,
  BodyText,
  EndNotes,
  Graphic,
  Metadata,
  SeoHeadline,
} from "tailor"

const metadata = {
  title: "Heat Tracker",
  description: "",
  authors: [{ "name": "Caleb Diehl" }],
  published: "2023-08-02T15:52:37.903Z",
}
const notes = [
  {
    title: "Produced by",
    note: "The AP Data Team",
  },
]

function Index() {
  return (
    <div>
      <Article>
        <SeoHeadline>{metadata.seoTitle || metadata.title}</SeoHeadline>
        <Metadata
          byline={`By ${toSentence(metadata.authors.map((a) => a.name))}`}
          date={metadata.published}
        />
        <BodyText>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            viverra diam vel libero tristique venenatis. Curabitur vitae quam
            vel nibh suscipit efficitur. Vestibulum ante ipsum primis in
            faucibus orci luctus et ultrices posuere cubilia curae; Proin eu
            sapien in dui tristique fringilla. Fusce eget tellus a libero
            dignissim porta.
          </p>
        </BodyText>
        <Graphic fluid>
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
        <EndNotes notes={notes} />
      </Article>
    </div>
  )
}

Index.propTypes = {}

Index.defaultProps = {}

export default Index
