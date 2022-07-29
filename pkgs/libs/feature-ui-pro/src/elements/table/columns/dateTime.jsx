import React from 'react'
import z from '@z1/lib-feature-box'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'

// parts
import { dateFn } from '../../parts'
import { headerRenderer } from './headerRenderer'

// main
export const dateTime = z.fn((t) => (props) => {
  return t.mergeDeepRight(props, {
    headerRenderer,
    cellRenderer: ({ rowData, column, cellData }) => {
      const timeAgo = t.and(
        t.notNil(column.timeAgo),
        t.eq(true, column.timeAgo)
      )
      return (
        <IconLabel
          key={t.to.snakeCase(`${column.title} ${rowData.id}`)}
          label={{
            text: t.isNil(column.format)
              ? `${cellData}`
              : t.isNil(cellData)
              ? ''
              : dateFn(cellData).format(column.format),
            fontSize: 'xs',
          }}
          info={
            timeAgo
              ? {
                  text: t.isNil(cellData) ? '' : dateFn().to(dateFn(cellData)),
                  color: 'gray-400',
                }
              : null
          }
          display="flex"
          flex={1}
          flexWrap={false}
          y="center"
          padding={{ x: 2 }}
        />
      )
    },
  })
})
