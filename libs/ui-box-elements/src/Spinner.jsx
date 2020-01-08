import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'

// main
const renderSpinner = fn(t => props => {
  const size = t.pathOr(null, ['size'], props)
  const color = t.pathOr(null, ['color'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['className', 'size', 'color', 'box'], props), {
      className: `spinner ${t.isNil(size) ? '' : ` spinner-${size}`} ${
        t.isNil(className) ? '' : ` ${className}`
      }`,
      box: t.merge(
        {
          color,
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

export class Spinner extends React.Component {
  render() {
    return renderSpinner(this.props)
  }
}
