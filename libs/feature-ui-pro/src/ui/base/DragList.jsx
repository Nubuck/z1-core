import React from 'react'
import z from '@z1/lib-feature-box'
import { Col, Row, toCss } from '@z1/lib-ui-box-elements'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'
import { DragSource } from 'react-dnd'

// parts
import { listData, externalNodeType } from './stubs'
import { VList } from '../../elements/VList'

// main
const externalNodeSpec = {
  // This needs to return an object with a property `node` in it.
  // Object rest spread is recommended to avoid side effects of
  // referencing the same object in different trees.
  beginDrag: (componentProps) => ({ node: { ...componentProps.node } }),
}
const externalNodeCollect = (connect /* , monitor */) => ({
  connectDragSource: connect.dragSource(),
  // Add props via react-dnd APIs to enable more visual
  // customization of your component
  // isDragging: monitor.isDragging(),
  // didDrop: monitor.didDrop(),
})
export const DragItem = z.fn((t) =>
  DragSource(
    externalNodeType,
    externalNodeSpec,
    externalNodeCollect
  )((props) => {
    const { connectDragSource, node } = props
    return connectDragSource(
      <div
        key="drag-item"
        className={toCss({
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          width: 'full',
          alignItems: 'center',
          cursor: 'move',
        })}
        style={props.style}
      >
        <IconLabel
          padding={{ x: 1, y: 1 }}
          borderWidth={true}
          borderColor={['gray-700', { hover: 'blue-500' }]}
          bgColor={[null, { hover: 'gray-800' }]}
          flex={1}
          slots={{
            icon: {
              flex: 'initial',
              padding: { x: 2 },
            },
            label: {
              padding: { left: 2 },
            },
          }}
          icon={{
            name: node.icon,
          }}
          label={{
            text: node.title,
            fontSize: 'sm',
          }}
        />
      </div>
    )
  })
)
export const DragList = z.fn((t) => (props) => {
  return (
    <Col flex={1} position="relative">
      <VList
        items={listData}
        rowHeight={40}
        render={(node, rowProps) => {
          return (
            <DragItem key={rowProps.key} style={rowProps.style} node={node} />
          )
        }}
      />
    </Col>
  )
})
