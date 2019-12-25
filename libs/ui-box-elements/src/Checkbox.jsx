import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
const renderCheckbox = task(t => props => {
  const as = t.pathOr('input', ['as'], props)
  const type = t.pathOr('checkbox', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'type'], props), {
      as,
      type,
      className: `form-checkbox${t.isNil(className) ? '' : ` ${className}`}`,
    })
  )
})

export class Checkbox extends React.Component {
  render() {
    return renderCheckbox(this.props)
  }
}