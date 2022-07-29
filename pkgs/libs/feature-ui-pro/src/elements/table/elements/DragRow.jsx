import React from 'react'
import z from '@z1/lib-feature-box'
import { toCss } from '@z1/lib-ui-box-elements'
import { DragSource, DropTarget } from 'react-dnd'

// main
const dragNodeSpec = {
  // This needs to return an object with a property `node` in it.
  // Object rest spread is recommended to avoid side effects of
  // referencing the same object in different trees.
  beginDrag: (componentProps) => {
    return { node: { ...componentProps.rowData.node } }
  },
}
const dragNodeCollect = (connect /* , monitor */) => ({
  connectDragSource: connect.dragSource(),
  // Add props via react-dnd APIs to enable more visual
  // customization of your component
  // isDragging: monitor.isDragging(),
  // didDrop: monitor.didDrop(),
})
const Row = DragSource(
  'command',
  dragNodeSpec,
  dragNodeCollect
)(({ key, index, children, connectDragSource, ...rest }) => {
  return connectDragSource(
    <div
      key={`row${key}`}
      index={index}
      className={toCss({
        display: 'flex',
        flex: 1,
      })}
      style={{ cursor: 'move' }}
    >
      <div {...rest}>{children}</div>
    </div>
  )
})
const dropNodeSpec = {
  canDrop(props, monitor) {
    return true
  },
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return
    }
    console.log('DROP PROPS', props)
  },
}
const dropNodeCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }
}
const DropRow = DropTarget(
  'command',
  dropNodeSpec,
  dropNodeCollect
)((props) => {
  const { isOver, canDrop, connectDropTarget, style, ...rest } = props
  // console.log('IS OVER', isOver)
  return connectDropTarget(
    <div
      key="dropper"
      style={{ ...style }}
      className={toCss({
        bgColor: isOver ? 'blue-800' : null,
        display: 'flex',
      })}
    >
      <Row {...rest} />
    </div>
  )
})

export const DragRow = DropRow
