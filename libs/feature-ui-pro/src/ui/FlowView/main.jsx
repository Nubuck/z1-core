import React from 'react'
import z from '@z1/lib-feature-box'
import SplitPane from 'react-split-pane/lib/SplitPane'
import Pane from 'react-split-pane/lib/Pane'
import { Value } from 'react-value'
// import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer'
import { AutoSizer } from 'react-virtualized'
import BaseTable, { Column } from 'react-base-table'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'

// els
// import { proFlow } from '../../elements/flow'
import { proTable } from '../../elements/table'

// parts
// import {
//   onNodeDragStart,
//   onNodeDragStop,
//   onElementClick,
//   onSelectionChange,
//   onElementsRemove,
//   onConnect,
// } from './fn'
import { commandData, flowData } from './stubs'

// main
export const FlowView = z.fn((t) => (props) => {
  return (
    <Value
      defaultValue={flowData}
      render={(elements, setElements) => {
        return (
          <SplitPane split="vertical" className="split-pane">
            <Pane key="table-tree" initialSize="20%" minSize="10%">
              <AutoSizer>
                {({ width, height }) => {
                  return (
                    <Value
                      defaultValue={{
                        data: commandData,
                        expandedRowKeys: [],
                      }}
                      render={(next, setNext) => {
                        return (
                          <BaseTable
                            {...proTable.tableProps({
                              ...next,
                              width,
                              height,
                              expandColumnKey: 'title',
                              rowKey: 'id',
                              rowHeight: 42,
                              onRowExpand: (props) => {
                                setNext(
                                  t.merge(next, {
                                    expandedRowKeys: props.expanded
                                      ? t.append(
                                          props.rowKey,
                                          next.expandedRowKeys
                                        )
                                      : t.filter(
                                          (key) => t.neq(props.rowKey, key),
                                          next.expandedRowKeys
                                        ),
                                  })
                                )
                              },
                            })}
                            columns={[
                              proTable.columns.basic({
                                key: 'title',
                                dataKey: 'node.title',
                                title: 'Job Layers',
                                icon: {
                                  name: 'layer-group',
                                  color: 'blue-500',
                                },
                                resizable: false,
                                sortable: true,
                                width: width - 1,
                                cell: {
                                  icon: 'node.icon',
                                },
                              }),
                            ]}
                          />
                        )
                      }}
                    />
                  )
                }}
              </AutoSizer>
            </Pane>
            <Pane key="flow">
              {/*   <ReactFlow
                {...proFlow.flowProps({
                  elements,
                  // onElementClick,
                  // onElementsRemove: onElementsRemove(elements, setElements),
                  onConnect: (params) =>
                    onConnect(elements, setElements, params),
                  // onNodeDragStart,
                  // onNodeDragStop,
                  // onSelectionChange,
                })}
              >
                <Background {...proFlow.backgroundProps()} />
                <MiniMap {...proFlow.miniMapProps()} />
                <Controls />
              </ReactFlow>
            */}{' '}
            </Pane>
          </SplitPane>
        )
      }}
    />
  )
})
/*

           

*/
