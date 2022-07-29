import React, { Component } from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, When, Button, toCss } from '@z1/lib-ui-box-elements'
import { ListItem } from '@z1/lib-feature-ui/dist/ListItem'

// parts
import { styles } from './styles'
import { isDescendant } from './isDescendant'

// node shape
const nodeShape = {
  _id: null,
  parentId: null,
  origin: null,
  shape: null,
  shapeData: {
    icon: null,
    iconOpen: null,
    color: null,
    abilities: [],
    accepts: [],
  },
  entity: null,
  entityId: null,
  entityData: {
    icon: null,
    color: null,
  },
  title: null,
}

const nodeProps = z.fn((t) => (nt, st, node) => {
  // basic
  const nodeTitle = nt || node.title
  const nodeSubtitle = st || node.subtitle
  const segment = t.at('segment', node)
  // pro
  const id = t.atOr(t.at('_id', node), 'id', node)
  const parentId = t.at('parentId', node)
  const origin = t.at('origin', node)
  const shape = t.at('shape', node)
  const shapeData = t.atOr({}, 'shapeData', node)
  const entity = t.at('entity', node)
  const entityData = t.atOr({}, 'entityData', node)
  const packageTitle = t.notNil(t.at('title', entityData))
    ? t.at('title', entityData)
    : nodeTitle
  const title = t.eq('package', shape) ? packageTitle : nodeTitle
  const nodeTrashed = t.eq(true, node.trashed)
  const iconWithColor = t.anyOf([t.eq('file', shape), t.eq('package', shape)])
    ? {
        icon: t.at('icon', entityData),
        color: nodeTrashed ? 'gray-400' : t.at('color', entityData),
      }
    : {
        icon: t.at('icon', shapeData),
        color: nodeTrashed ? 'gray-400' : t.at('color', shapeData),
      }
  // const expandable = t.anyOf([t.eq('folder', shape), t.eq('package', shape)])
  const expandable = t.eq('folder', shape)
  // const titleIcon = expandable ? t.at('icon', entityData) : null
  const titleIcon = null
  const iconOpen = expandable ? t.at('iconOpen', shapeData) : iconWithColor.icon
  // yield
  return {
    id,
    parentId,
    origin,
    shape,
    entity,
    title,
    titleIcon,
    subtitle: nodeSubtitle,
    segment,
    iconOpen,
    ...iconWithColor,
  }
})

// main
export const renderNodeContent = z.fn(
  (t) => ({
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
  }) => {
    const btns = t.atOr(buttons || [], 'buttons', node)
    const np = nodeProps(title, subtitle, node)

    const isDraggedDescendant = t.isNil(draggedNode)
      ? false
      : isDescendant(draggedNode, node)
    const isLandingPadActive = t.and(t.not(didDrop), isDragging)
    const nodeChildren = t.atOr([], 'children', node)
    const hasChildren = t.or(
      t.ofType('function', nodeChildren),
      t.hasLen(nodeChildren)
    )
    const boxCss = t.filter(t.notNil, [
      styles.row,
      isLandingPadActive ? styles.rowLandingPad : null,
      t.and(isLandingPadActive, t.not(canDrop)) ? styles.rowCancelPad : null,
      isSearchMatch ? styles.rowSearchMatch : null,
      isSearchFocus ? styles.rowSearchFocus : null,
      className ? className : null,
    ])
    const labelProps = t.isNil(node.labelProps) ? {} : node.labelProps
    return connectDragPreview(
      <div
        className={t.tags.oneLineInlineLists`${boxCss}`}
        style={{
          opacity: isDraggedDescendant ? 0.5 : 1,
          ...style,
        }}
      >
        <ListItem
          bgColor={[null, { hover: 'gray-800' }]}
          flex={1}
          zIndex={10}
          y="center"
          color={[
            t.and(node.expanded, hasChildren) ? 'white' : 'gray-400',
            { hover: 'white' },
          ]}
          borderWidth={true}
          borderColor={[
            'transparent',
            { hover: t.not(canDrag) ? 'gray-600' : 'blue-500' },
          ]}
          borderRadius="sm"
          transition="colors"
          userSelect="none"
          slots={{
            avatar: { padding: 0, y: 'center' },
            main: { y: 'center' },
            last: {
              y: 'center',
              x: 'center',
              padding: {
                x: 2,
              },
            },
            buttons: {
              flex: 1,
              className: 'item-buttons',
              transition: 'opacity',
              padding: { left: 4 },
            },
            heading: {
              padding: { left: 0 },
              y: 'center',
            },
          }}
          avatar={{
            icon: {
              name: t.and(node.expanded, hasChildren) ? np.iconOpen : np.icon,
              fontSize: '3xl',
            },
            size: 'sm',
            fill: 'solid',
            padding: 0,
            colors: {
              off: {
                border: 'gray-500',
                bg: 'gray-900',
                content: 'inherit',
              },
              on: {
                border: 'gray-500',
                bg: 'transparent',
                content: np.color,
              },
            },
            transition: 'inherit',
            box: {
              borderRadius: 'sm',
            },
            cursor: t.includes(node.shape, ['share', 'trash']) ? null : 'move',
          }}
          heading={{
            icon: np.titleIcon,
            y: 'center',
            label: t.merge(
              {
                text: np.title,
                fontSize: 'sm',
                letterSpacing: 'wider',
              },
              labelProps
            ),
          }}
          subheading={t.isNil(np.subtitle) ? null : { label: np.subtitle }}
          buttons={btns}
          segment={
            t.isNil(np.segment)
              ? null
              : t.merge(np.segment, {
                  onChange: (action) => {
                    if (t.notNil(onAction)) {
                      onAction(action, np.id)
                    }
                  },
                })
          }
        />
      </div>
    )
  }
)
