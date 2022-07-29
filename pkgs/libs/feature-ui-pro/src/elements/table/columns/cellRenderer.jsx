import React from 'react'
import z from '@z1/lib-feature-box'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'

// main
export const cellRenderer = z.fn((t) => ({ rowData, cellData, column }) => {
  // slots: icon, label, info
  // types: string, path, object, function
  const cellTitle = t.at('cell.title', column)
  const title = t.ofType('function', cellTitle)
    ? cellTitle({ rowData, cellData, column })
    : null
  const cellCaption = t.at('cell.caption', column)
  const caption = t.ofType('function', cellCaption)
    ? cellCaption({ rowData, cellData, column })
    : null
  const cellIcon = t.at('cell.icon', column)
  const cellLabel = t.at('cell.label', column)
  const label = t.ofType('object', cellLabel)
    ? cellLabel
    : t.ofType('function', cellLabel)
    ? cellLabel({ rowData, cellData, column })
    : {}
  const iconType = t.isNil(cellIcon)
    ? 'none'
    : t.ofType('function', cellIcon)
    ? 'handle'
    : t.ofType('string', cellIcon)
    ? t.includes('.', cellIcon)
      ? 'path'
      : 'string'
    : t.and(
        t.includes('.', t.atOr('', 'name', cellIcon)),
        t.includes('.', t.atOr('', 'color', cellIcon))
      )
    ? 'name-color-path'
    : t.includes('.', t.atOr('', 'name', cellIcon))
    ? 'name-path'
    : 'icon'
  const cellInfo = t.at('cell.info', column)
  const infoType = t.isNil(cellInfo)
    ? 'none'
    : t.ofType('function', cellInfo)
    ? 'handle'
    : t.ofType('string', cellInfo)
    ? t.includes('.', cellInfo)
      ? 'path'
      : 'string'
    : 'info'
  const icon = t.runMatch({
    _: () => null,
    string: () => ({ name: cellIcon }),
    path: () => t.at(cellIcon, rowData),
    icon: () => cellIcon,
    'name-color-path': () =>
      t.merge(cellIcon, {
        name: t.at(cellIcon.name, rowData),
        color: t.at(cellIcon.color, rowData),
      }),
    'name-path': () =>
      t.merge(cellIcon, {
        name: t.at(cellIcon.name, rowData),
      }),
    handle: () => cellIcon({ rowData, cellData, column }),
  })(iconType)
  const info = t.runMatch({
    _: () => null,
    string: () => ({ text: cellInfo, fontSize: 'xs' }),
    path: () => t.merge(cellInfo, { text: t.at(cellInfo, rowData) }),
    info: () => cellInfo,
    handle: () => cellInfo({ rowData, cellData, column }),
  })(infoType)
  const cellProps = t.atOr({}, 'cell.props', column)
  const p = t.ofType('function', cellProps)
    ? cellProps({ rowData, cellData, column })
    : cellProps
  // yield
  return (
    <IconLabel
      key={t.to.snakeCase(`${column.title} ${rowData._id}`)}
      slots={{ label: { padding: { left: 1 } } }}
      icon={icon}
      title={`${cellData}`}
      label={{
        text: t.isNil(cellData) ? '' : t.take(300, `${cellData}`),
        letterSpacing: 'wider',
        className: 'cell-label',
        ...label,
      }}
      info={info}
      caption={caption}
      display="flex"
      flex={1}
      y="center"
      flexWrap={false}
      padding={{ x: 1 }}
      minHeight="full"
      {...p}
    />
  )
})
