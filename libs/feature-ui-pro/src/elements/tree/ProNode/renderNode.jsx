import React, { Component } from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, When, Button, toCss } from '@z1/lib-ui-box-elements'

// parts
import { styles } from './styles'
import { renderNodeContent } from './renderNodeContent'

// main
export const renderNode = z.fn((t) => (props) => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    node,
    title,
    subtitle,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    icons,
    buttons,
    className,
    style,
    didDrop,
    lowerSiblingCounts,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    treeId, // Not needed, but preserved for other renderers
    isOver, // Not needed, but preserved for other renderers
    parentNode, // Needed for dndManager
    rowDirection, // Not neeeded, but sick of the warning errors
    rowIndex, // Not neeeded, but sick of the warning errors
    ...rest
  } = props
  const { onAction, ...otherProps } = rest
  
  const nodeContent = renderNodeContent({
    connectDragPreview,
    canDrag,
    isDragging,
    canDrop,
    didDrop,
    isSearchMatch,
    isSearchFocus,
    className,
    node,
    title,
    subtitle,
    draggedNode,
    style,
    buttons,
    onAction,
  })

  const nodeChildren = t.atOr([], 'children', node)

  return (
    <div style={{ height: '100%' }} {...otherProps}>
      <When
        is={t.or(
          t.ofType('function', nodeChildren),
          t.and(toggleChildrenVisibility, t.hasLen(nodeChildren))
        )}
        render={() => {
          return (
            <div>
              <Button
                shape="normal"
                fill="solid"
                size="xs"
                position="absolute"
                opacity={1}
                colors={{
                  off: {
                    border: 'gray-500',
                    bg: 'gray-800',
                    content: 'gray-400',
                  },
                  on: {
                    border: 'blue-500',
                    bg: 'blue-500',
                    content: 'white',
                  },
                }}
                slots={{
                  content: { flex: 1 },
                }}
                box={{
                  borderWidth: [true, { hover: true }],
                  borderColor: ['gray-500', { hover: 'blue-500' }],
                  borderRadius: 'sm',
                }}
                icon={{
                  name: 'angle-right',
                  fontSize: 'sm',
                  transition: 'all',
                  className: node.expanded ? 'la-rotate-90' : null,
                }}
                style={{ left: -0.5 * scaffoldBlockPxWidth }}
                className={
                  node.expanded ? styles.collapseButton : styles.expandButton
                }
                onClick={() =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                  })
                }
              />
              <When
                is={t.and(node.expanded, t.not(isDragging))}
                render={() => (
                  <div
                    style={{ width: scaffoldBlockPxWidth }}
                    className={styles.lineChildren}
                  />
                )}
              />
            </div>
          )
        }}
      />

      <div
        className={`${styles.rowWrapper}${
          t.not(canDrag) ? ` ${styles.rowWrapperDragDisabled}` : ''
        }`}
      >
        <When
          is={canDrag}
          render={() => connectDragSource(nodeContent, { dropEffect: 'copy' })}
          elseRender={() => nodeContent}
        />
      </div>
    </div>
  )
})
