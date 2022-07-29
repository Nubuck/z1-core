import React from 'react'
import z from '@z1/lib-feature-box'
import { Col } from '@z1/lib-ui-box-elements'
import { AutoSizer } from 'react-virtualized'
import { Value } from 'react-value'
import { SortableTreeWithoutDndContext } from 'react-sortable-tree'

// parts
import { baseData, externalNodeType } from './stubs'

// elements
import { treeBaseTheme } from '../elements/tree-base-theme'

// main
export const Tree = z.fn((t) => (props) => {
  const canDrop = ({ node, nextParent, prevPath, nextPath }) => {
    const pChild = t.at('allowChildren', nextParent || {})
    const maxChildren = t.at('maxChildren', nextParent || {})
    const nextChildren = t.atOr([], 'children', nextParent || {})
    if (t.notNil(maxChildren)) {
      if (t.gt(t.len(nextChildren), maxChildren)) {
        return false
      }
    }
    return t.anyOf([t.eq(true, pChild), t.isNil(pChild)])
  }
  const canDrag = ({node}) => {
    return t.atOr(true, 'allowDrag', node || {})
  }
  return (
    <Col flex={1} position="relative">
      <AutoSizer>
        {({ width, height }) => {
          return (
            <Value
              defaultValue={baseData}
              render={(treeData, setTreeData) => {
                return (
                  <Col style={{ width, height }}>
                    <SortableTreeWithoutDndContext
                      theme={treeBaseTheme}
                      treeData={treeData}
                      onChange={(data) => setTreeData(data)}
                      rowHeight={58}
                      dndType={externalNodeType}
                      reactVirtualizedListProps={{
                        className: 'scrollbar',
                      }}
                      canDrop={canDrop}
                      canDrag={canDrag}
                    />
                  </Col>
                )
              }}
            />
          )
        }}
      </AutoSizer>
    </Col>
  )
})
