import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col } from '@z1/lib-ui-box-elements'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'
import SplitPane from 'react-split-pane/lib/SplitPane'
import Pane from 'react-split-pane/lib/Pane'

// parts

// main
export const BuilderView = z.fn((t) => (props) => {
  return (
    <SplitPane split="vertical" className="split-pane">
      <Pane initialSize="20%" minSize="15%">
        <Col flex={1} padding={3}>
          <h1>Element List</h1>
        </Col>
      </Pane>
      <Pane initialSize="30%" minSize="20%">
        <Col flex={1} padding={3}>
          <h1>Tree</h1>
        </Col>
      </Pane>
      <Pane>
        <Col flex={1} padding={3}>
          <h1>View Preview</h1>
        </Col>
      </Pane>
    </SplitPane>
  )
})
