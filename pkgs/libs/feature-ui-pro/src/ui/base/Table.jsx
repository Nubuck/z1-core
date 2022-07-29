import '../elements/base-table'
import React from 'react'
import z from '@z1/lib-feature-box'
import { Col } from '@z1/lib-ui-box-elements'
import { AutoSizer } from 'react-virtualized'
import BaseTable, { Column, SortOrder } from 'react-base-table'

// elements
import { DragRow } from '../elements/base-table/DragRow'

// parts
import { generateColumns, generateData } from './stubs'
const columns = generateColumns(3)
for (let i = 0; i < 3; i++) columns[i].sortable = true

const defaultSort = { key: 'column-0', order: SortOrder.ASC }
const tableData = generateData(columns, 200)

// main
export const Table = z.fn((t) => (props) => {
  return (
    <Col flex={1} position="relative">
      <AutoSizer>
        {({ width, height }) => (
          <BaseTable
            width={width}
            height={height}
            columns={columns}
            data={tableData}
            sortBy={defaultSort}
            rowProps={(base) => {
              return t.merge(base, {
                tagName: (p) => <DragRow {...base} {...p} />,
              })
            }}
          />
        )}
      </AutoSizer>
    </Col>
  )
})
