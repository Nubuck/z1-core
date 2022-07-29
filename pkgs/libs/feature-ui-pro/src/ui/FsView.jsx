import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, Button } from '@z1/lib-ui-box-elements'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'
import SplitPane from 'react-split-pane/lib/SplitPane'
import Pane from 'react-split-pane/lib/Pane'
import { AutoSizer } from 'react-virtualized'
import { Value } from 'react-value'
import { SortableTreeWithoutDndContext } from 'react-sortable-tree'
import BaseTable from 'react-base-table'

// elements
import { proTree } from '../elements/tree'
import { proTable } from '../elements/table'

// parts
const itemButtons = [
  {
    icon: 'gear',
    shape: 'circle',
    fill: 'solid',
    size: 'xs',
    colors: {
      off: { bg: 'gray-700', content: 'gray-400' },
      on: { bg: 'blue-500', content: 'white' },
    },
    margin: { left: 1 },
    transition: 'colors',
    title: 'edit folder',
  },
  {
    icon: 'plus',
    shape: 'circle',
    fill: 'solid',
    size: 'xs',
    colors: {
      off: { bg: 'gray-700', content: 'gray-400' },
      on: { bg: 'yellow-500', content: 'gray-900' },
    },
    margin: { left: 1 },
    transition: 'colors',
    title: 'create sub-folder',
    // onClick: (e) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    // },
  },
  {
    icon: { name: 'trash', letterSpacing: 'tighter' },
    shape: 'circle',
    fill: 'solid',
    size: 'xs',
    colors: {
      off: { bg: 'gray-700', content: 'gray-400' },
      on: { bg: 'red-500', content: 'white' },
    },
    margin: { left: 1 },
    transition: 'colors',
    title: 'remove folder',
  },
]
const itemSegment = {
  alignSelf: 'auto',
  size: 'xs',
  fill: 'solid',
  shape: 'circle',
  bgColor: 'gray-700',
  color: 'gray-400',
  borderRadius: 'sm',
  buttons: {
    settings: {
      icon: 'gear',
      shape: 'circle',
      fill: 'solid',
      size: 'xs',
      colors: {
        off: { bg: 'gray-700', content: 'gray-400' },
        on: { bg: 'blue-500', content: 'white' },
      },
      transition: 'colors',
      title: 'edit folder',
    },
    create: {
      icon: 'plus',
      shape: 'circle',
      fill: 'solid',
      size: 'xs',
      colors: {
        off: { bg: 'gray-700', content: 'gray-400' },
        on: { bg: 'yellow-500', content: 'gray-900' },
      },
      margin: { left: 1 },
      transition: 'colors',
      title: 'create sub-folder',
    },
    remove: {
      icon: { name: 'times', letterSpacing: 'tighter' },
      shape: 'circle',
      fill: 'solid',
      size: 'xs',
      colors: {
        off: { bg: 'gray-700', content: 'gray-400' },
        on: { bg: 'red-500', content: 'white' },
      },
      transition: 'colors',
      title: 'remove folder',
    },
  },
}
const folderData = [
  {
    dataType: 'folder',
    title: 'Home',
    titleIcon: 'home',
    expanded: 'true',
    canDrag: false,
    expanded: true,
    children: [
      {
        dataType: 'folder',
        title: 'Shared',
        titleIcon: 'share-alt',
        // buttons: itemButtons,
        segment: itemSegment,
      },
      {
        dataType: 'folder',
        title: 'Shared with me',
        titleIcon: 'share-alt',
        allowChildren: false,
        children: [
          {
            dataType: 'folder',
            title: 'Sample',
          },
        ],
      },
      {
        dataType: 'folder',
        title: 'Projects',
        titleIcon: 'project-diagram',
        headingProps: {
          as: 'a',
          cursor: 'pointer',
          color: [null, { hover: 'blue-500' }],
        },
        expanded: true,
        // buttons: itemButtons,
        segment: itemSegment,
        children: [
          {
            dataType: 'folder',
            title: 'Training',
            headingProps: {
              as: 'a',
              cursor: 'pointer',
              color: [null, { hover: 'blue-500' }],
            },
            // buttons: itemButtons,
            segment: itemSegment,
          },
          {
            dataType: 'folder',
            title: 'Demo',
            headingProps: {
              as: 'a',
              cursor: 'pointer',
              color: [null, { hover: 'blue-500' }],
            },
            // buttons: itemButtons,
            segment: itemSegment,
          },
          {
            dataType: 'folder',
            title: 'Client',
            headingProps: {
              as: 'a',
              cursor: 'pointer',
              color: [null, { hover: 'blue-500' }],
            },
            // buttons: itemButtons,
            segment: itemSegment,
          },
        ],
      },
    ],
  },
]
const contentsData = [
  {
    id: 'A',
    parentId: null,
    node: {
      _id: 'A',
      icon: {
        name: 'folder',
        className: 'la-rotate-270',
        color: 'blue-500',
        size: '3xl',
      },
      title: 'Training',
      label: {
        as: 'a',
        color: ['white', { hover: 'blue-500' }],
        cursor: 'pointer',
      },
      dataType: 'folder',
      updatedAt: new Date(),
      createdAt: new Date('2020-07-17T03:24:00'),
    },
  },
  {
    id: 'B',
    parentId: null,
    node: {
      _id: 'B',
      icon: {
        name: 'project-diagram',
        color: 'yellow-500',
      },
      title: 'Run a task until finished 2',
      dataType: 'macro',
      updatedAt: new Date(),
      createdAt: new Date('2020-07-17T03:24:00'),
      size: 120000,
    },
  },
  {
    id: 'C',
    parentId: null,
    node: {
      _id: 'C',
      icon: {
        name: 'project-diagram',
        color: 'yellow-500',
      },
      title: 'Fetch some data 3',
      dataType: 'macro',
      updatedAt: new Date(),
      createdAt: new Date('2020-07-17T03:24:00'),
      size: 120000,
    },
  },
  {
    id: 'D',
    parentId: null,
    node: {
      _id: 'D',
      icon: {
        name: 'project-diagram',
        color: 'yellow-500',
      },
      title: 'Test 4',
      dataType: 'macro',
      updatedAt: new Date(),
      createdAt: new Date('2020-07-17T03:24:00'),
      size: 120000,
    },
  },
  {
    id: 'E',
    parentId: null,
    node: {
      _id: 'E',
      icon: {
        name: 'shapes',
        color: 'pink-500',
      },
      title: 'Test 4',
      dataType: 'data shape',
      updatedAt: new Date(),
      createdAt: new Date('2020-07-17T03:24:00'),
      size: 500,
    },
  },
]

// main
export const FsView = z.fn((t) => (props) => {
  return (
    <SplitPane split="vertical" className="split-pane">
      <Pane initialSize="20%" minSize="10%">
        <AutoSizer>
          {({ width, height }) => {
            return (
              <Value
                defaultValue={folderData}
                render={(treeData, setTreeData) => {
                  return (
                    <SortableTreeWithoutDndContext
                      {...proTree.treeProps({
                        width,
                        height,
                        treeData,
                        onChange: (data) => setTreeData(data),
                        dndType: 'command',
                      })}
                    />
                  )
                }}
              />
            )
          }}
        </AutoSizer>
      </Pane>
      <Pane>
        <AutoSizer>
          {({ width, height }) => {
            const selectorWidth = 40
            const bytesWidth = 90
            const typeWidth = 140
            const dateWidth = 200
            const actionWidth = 120
            const evenWidth =
              width -
              selectorWidth -
              typeWidth -
              bytesWidth -
              dateWidth * 2 -
              actionWidth -
              1
            return (
              <Value
                defaultValue={contentsData}
                render={(tableData, setTableData) => {
                  return (
                    <BaseTable
                      {...proTable.tableProps({
                        width,
                        height,
                        data: tableData,
                        rowKey: 'id',
                        fixed: false,
                        columns: [
                          proTable.columns.selector({
                            key: 'Selector',
                            dataKey: 'node._id',
                            width: selectorWidth,
                            onChange: (id, selected) => {
                              console.log('ID SELECTED', id, selected)
                            },
                          }),
                          proTable.columns.basic({
                            key: 'Basic',
                            dataKey: 'node.title',
                            title: 'Name',
                            resizable: true,
                            sortable: true,
                            width: evenWidth,
                            cell: {
                              icon: 'node.icon',
                            },
                          }),
                          proTable.columns.basic({
                            key: 'Type',
                            dataKey: 'node.dataType',
                            title: 'Type',
                            resizable: true,
                            sortable: true,
                            width: typeWidth,
                          }),
                          proTable.columns.bytes({
                            key: 'bytes',
                            dataKey: 'node.size',
                            title: 'Size',
                            resizable: true,
                            sortable: true,
                            width: bytesWidth,
                          }),
                          proTable.columns.dateTime({
                            key: 'Modfied',
                            dataKey: 'node.updatedAt',
                            title: 'Last updated',
                            icon: 'calendar-check',
                            resizable: true,
                            sortable: true,
                            width: dateWidth,
                            format: 'YYYY MM DD HH:mm:ss A',
                            timeAgo: true,
                          }),
                          proTable.columns.dateTime({
                            key: 'Created',
                            dataKey: 'node.createdAt',
                            title: 'Created',
                            icon: 'calendar-plus',
                            resizable: true,
                            sortable: true,
                            width: dateWidth,
                            format: 'YYYY MM DD HH:mm:ss A',
                            timeAgo: true,
                          }),
                          proTable.columns.buttons({
                            key: 'Buttons',
                            dataKey: 'node._id',
                            // title: 'Actions',
                            resizable: false,
                            sortable: false,
                            selectable: false,
                            width: actionWidth,
                            buttons: {
                              edit: {
                                icon: 'gear',
                                bg: 'blue-500',
                              },
                              download: {
                                icon: 'download',
                                bg: 'blue-500',
                              },
                              delete: {
                                icon: 'times',
                                bg: 'red-500',
                              },
                            },
                            onChange: (btn, data) => {
                              console.log('BUTTON CLICK', btn, data)
                            },
                          }),
                        ],
                      })}
                    />
                  )
                }}
              />
            )
          }}
        </AutoSizer>
      </Pane>
    </SplitPane>
  )
})

// other types: file size, format number
