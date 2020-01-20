import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'

// main
const renderButton = fn(t => props => {
  const as = t.pathOr('button', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  const size = t.pathOr('md', ['size'], props)
  const color = t.pathOr(null, ['color'], props)
  const bgColor = t.pathOr(null, ['bg'], props)
  const borderColor = t.pathOr(null, ['border'], props)
  const borderRadius = t.pathOr(null, ['radius'], props)
  const borderWidth = t.pathOr(null, ['borderWidth'], props)
  const fontWeight = t.pathOr(null, ['weight'], props)
  const fontFamily = t.pathOr(null, ['family'], props)
  const fontSize = t.pathOr(null, ['fontSize'], props)
  const proportion = t.getMatch(size)({
    xs: {
      padding: { x: 2, y: 2 },
      fontSize: fontSize || 'xs',
      fontWeight: fontWeight || 'normal',
    },
    sm: {
      padding: { x: 2, y: 2 },
      fontSize: fontSize || 'sm',
      fontWeight: fontWeight || 'normal',
    },
    md: {
      padding: { x: 3, y: 2 },
      fontSize: fontSize || 'base',
      fontWeight: fontWeight || 'bold',
    },
    lg: {
      padding: { x: 4, y: 3 },
      fontSize: fontSize || 'lg',
      fontWeight: fontWeight || 'bold',
    },
  })
  return React.createElement(
    Box,
    t.merge(
      t.omit(
        [
          'as',
          'className',
          'box',
          'size',
          'color',
          'bg',
          'border',
          'radius',
          'borderWidth',
          'weight',
          'family',
        ],
        props
      ),
      {
        as,
        className,
        box: t.mergeAll([
          {
            color,
            bgColor,
            borderColor,
            borderRadius,
            fontFamily,
            borderWidth: t.and(t.isNil(borderColor), t.isNil(borderWidth))
              ? null
              : t.isNil(borderWidth)
              ? true
              : borderWidth,
          },
          proportion,
          t.pathOr({}, ['box'], props),
        ]),
      }
    )
  )
})

export class Button extends React.Component {
  render() {
    return renderButton(this.props)
  }
}
