export const externalNodeType = 'command'

export const baseData = [
  // { title: 'This is the Full Node Drag theme' },
  // { title: 'You can click anywhere on the node to drag it' },
  // {
  //   title: 'This node has dragging disabled',
  //   subtitle: 'Note how the hover behavior is different',
  //   dragDisabled: true,
  // },
  // { title: 'Chicken', children: [{ title: 'Egg' }] },
]

export const generateColumns = (count = 10, prefix = 'column-', props) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
    resizable: true,
  }))

export const generateData = (columns, count = 200, prefix = 'row-') =>
  new Array(count).fill(0).map((row, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
        node: {
          icon: 'th-list',
          title: `Data Type ${prefix} ${rowIndex}`,
        },
      }
    )
  })
  
export const listData = [
  {
    icon: 'th-list',
    title: 'Data Type A',
    allowChildren: false,
  },
  {
    icon: 'th-list',
    title: 'Data Type B',
    allowChildren: false,
  },
  {
    icon: 'th-list',
    title: 'Data Type C',
    allowChildren: true,
    maxChildren: 1,
  },
  {
    icon: 'th-list',
    title: 'When',
    expanded: true,
    allowChildren: false,
    children: [
      {
        icon: 'list',
        title: 'Render',
        allowChildren: true,
        allowDrag: false,
      },
      {
        icon: 'list',
        title: 'Else render',
        allowChildren: true,
        allowDrag: false,
      },
    ],
  },
  {
    icon: 'th-list',
    title: 'Data Type E',
  },
  {
    icon: 'th-list',
    title: 'Data Type F',
  },
  {
    icon: 'th-list',
    title: 'Data Type G',
  },
]
