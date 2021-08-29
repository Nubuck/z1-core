import React from 'react'
import z from '@z1/lib-feature-box'
import { Row } from '@z1/lib-ui-box-elements'
import { Segment } from '@z1/lib-feature-ui/dist/Segment'

// parts
import { headerRenderer } from './headerRenderer'

// main
export const buttons = z.fn((t) => (props) => {
  const getSelected = t.atOr(() => null, 'getSelected', props)
  const segment = t.atOr({}, 'segment', props)
  return t.mergeDeepRight(props, {
    headerRenderer,
    cellRenderer: ({ rowData, column }) => {
      const cellProps = t.atOr({}, 'cellProps', column)
      return (
        <Row
          key={t.to.snakeCase(`${column.title} ${rowData.id}`)}
          flex={1}
          y="center"
          x="right"
          flexWrap={false}
          padding={{ x: 2 }}
          {...cellProps}
        >
          <Segment
            alignSelf="auto"
            size="xs"
            fill="solid"
            shape="circle"
            bgColor="gray-700"
            color="gray-400"
            borderRadius="sm"
            className="cell-action"
            selected={getSelected(rowData)}
            {...segment}
            buttons={
              t.ofType('object', column.buttons)
                ? t.mapObjIndexed((btn) => {
                    return t.mergeDeepRight(
                      {
                        colors: {
                          off: {
                            content: 'inherit',
                          },
                          on: {
                            bg: btn.bg || 'gray-600',
                            content: btn.color || 'white',
                          },
                        },
                      },
                      btn
                    )
                  }, column.buttons)
                : t.ofType('function', column.buttons)
                ? column.buttons({ rowData })
                : null
            }
            onChange={(btn) => {
              column.onChange && column.onChange(btn, rowData)
            }}
          />
        </Row>
      )
    },
  })
})
