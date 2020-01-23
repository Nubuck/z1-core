import React from 'react'
import { fn } from '@z1/lib-ui-box'

// main
const renderMapIndexed = fn(t => props => {
  const render = t.pathOr(null, ['render'], props)
  if (t.notType(render, 'Function')) {
    return null
  }
  const list = t.pathOr(null, ['list'], props)
  const items = t.isNil(list) ? t.pathOr([], ['items'], props) : list
  return React.createElement(
    React.Fragment,
    {},
    t.mapIndexed((item, index) => render(item, index), items)
  )
})

export class MapIndexed extends React.Component {
  render() {
    return renderMapIndexed(this.props)
  }
}
MapIndexed.displayName = 'MapIndexed'