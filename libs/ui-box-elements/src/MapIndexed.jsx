import React from 'react'
import { fn } from '@z1/lib-ui-box'

// main
const renderMapIndexed = fn((t) => (props) => {
  const render = t.atOr(null, 'render', props)
  if (t.notType(render, 'Function')) {
    return null
  }
  const list = t.atOr(null, 'list', props)
  const items = t.isNil(list) ? t.atOr([], 'items', props) : list
  const emptyRender = t.atOr(null, 'emptyRender', props)
  if (t.and(t.noLen(items), t.isType(emptyRender, 'Function'))) {
    return emptyRender({})
  }
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
