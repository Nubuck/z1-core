import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, Match } from '@z1/lib-ui-box-elements'
import { Value } from 'react-value'

// parts
import '../elements/split-pane/split-pane.scss'
// import '../elements/base-table/base-table.scss'
import { Nav } from './Nav'
import { FsView } from './FsView'
import { DataTypeView } from './DataTypeView'
import { FlowView } from './FlowView'
import { BuilderView } from './BuilderView'

// main
export const Layout = z.fn((t) => () => {
  return (
    <Value
      defaultValue={{
        active: 'flow',
      }}
      render={(view, setView) => {
        return (
          <Row flex={1} position="relative" padding={{ left: 10 }}>
            <Nav view={view} setView={setView} />
            <Col flex={1} position="relative">
              <Match
                value={view.active}
                render={{
                  fs: () => {
                    return <FsView />
                  },
                  dataTypes: () => {
                    return <DataTypeView />
                  },
                  flow: () => {
                    return <FlowView />
                  },
                  builder: () => {
                    return <BuilderView />
                  },
                }}
              />
            </Col>
          </Row>
        )
      }}
    />
  )
})
