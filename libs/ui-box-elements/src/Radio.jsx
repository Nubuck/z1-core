import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
const renderRadio = task(t => props => {
  const as = t.pathOr('input', ['as'], props)
  const type = t.pathOr('radio', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'type'], props), {
      as,
      type,
      className: `form-radio${t.isNil(className) ? '' : ` ${className}`}`,
    })
  )
})

export class Radio extends React.Component {
  render() {
    return renderRadio(this.props)
  }
}