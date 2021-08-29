import React from 'react'
import z from '@z1/lib-feature-box'
import { Col, Button, Match, toCss } from '@z1/lib-ui-box-elements'
import { SortOrder } from 'react-base-table'

// parts
const colors = {
  off: {
    content: 'inherit',
  },
  on: {
    content: 'yellow-500',
  },
}
const sortIcon = z.fn((t) =>
  t.match({
    [SortOrder.ASC]: 'angle-up',
    [SortOrder.DESC]: 'angle-down',
  })
)
// main
export const SortIndicator = z.fn((t) => ({ sortOrder, className, style }) => {
  return (
    <Col
      y="center"
      x="center"
      flex="initial"
      padding={{ y: 1, x: 2 }}
      userSelect="none"
      className={className}
      style={style}
    >
      <Button
        fill="solid"
        shape="circle"
        icon={{ name: sortIcon(sortOrder), fontSize: 'lg' }}
        size="xs"
        colors={colors}
        box={{
          borderRadius: 'md',
        }}
      />
    </Col>
  )
})
