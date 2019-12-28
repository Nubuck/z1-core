import React from 'react'
import { fn } from '@z1/lib-ui-box-tailwind'

// elements
import { HStack } from './Stack'

// main
const renderRow = fn(t => props =>
  React.createElement(
    HStack,
    t.merge(t.omit(['box'], props), {
      box: t.merge({ flexWrap: true }, t.pathOr({}, ['box'], props)),
    })
  )
)

export class Row extends React.Component {
  render() {
    return renderRow(this.props)
  }
}
