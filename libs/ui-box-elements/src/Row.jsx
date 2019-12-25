import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { HStack } from './Stack'

// main
const renderRow = task(t => props =>
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
