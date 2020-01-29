import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderResponsiveStack } from './Stack'

// main
const renderRow = fn(t => props =>
  renderResponsiveStack(
    'horizontal',
    t.merge(t.omit(['box'], props), {
      box: t.merge({ flexWrap: true }, t.atOr({}, 'box', props)),
    })
  )
)

export class Row extends React.Component {
  render() {
    return renderRow(this.props)
  }
}
Row.displayName = 'Row'