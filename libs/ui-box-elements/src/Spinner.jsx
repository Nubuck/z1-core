import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'

// main
const matchSize = fn(t =>
  t.match({
    default: {
      width: '1rem',
      height: '1rem',
    },
    sm: {
      width: '2rem',
      height: '2rem',
    },
    md: {
      width: '3rem',
      height: '3rem',
    },
    lg: {
      width: '6rem',
      height: '6rem',
    },
    xl: {
      width: '12rem',
      height: '12rem',
    },
    _: {},
  })
)
const renderSpinner = fn(t => props => {
  const size = t.pathOr('default', ['size'], props)
  const color = t.pathOr('white', ['color'], props)
  const className = t.pathOr(null, ['className'], props)
  const style = t.pathOr({}, ['style'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['className', 'size', 'color', 'box'], props), {
      className: `spinner${
        t.eq(size, 'default') ? '' : ` spinner-${size}`
      } ${`spinner-${color}`}${t.isNil(className) ? '' : ` ${className}`}`,
      box: t.merge(
        {
          display: 'block',
        },
        t.pathOr({}, ['box'], props)
      ),
      style: t.merge(style, matchSize(size)),
    })
  )
})

export class Spinner extends React.Component {
  render() {
    return renderSpinner(this.props)
  }
}
Spinner.displayName = 'Spinner'