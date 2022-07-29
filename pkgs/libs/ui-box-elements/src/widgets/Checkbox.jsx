import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from '../Box'

// main
const renderCheckbox = fn((t) => (props) => {
  const el = t.atOr('input', 'as', props)
  const type = t.atOr('checkbox', 'as', props)
  const className = t.atOr(null, 'className', props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'type'], props), {
      as: el,
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
