import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
const renderSpacer = task(t => props =>
  React.createElement(
    Box,
    t.merge(t.omit(['box'], props), {
      box: t.merge({ flex: 1 }, t.pathOr({}, ['box'], props)),
    })
  )
)

export class Spacer extends React.Component {
  render() {
    return renderSpacer(this.props)
  }
}
