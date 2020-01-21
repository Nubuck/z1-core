import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from '../Box'

// main
const renderText = fn(t => props => {
  const as = t.pathOr('span', ['as'], props)
  const fontSize = t.pathOr(null, ['size'], props)
  const fontFamily = t.pathOr(null, ['family'], props)
  const fontWeight = t.pathOr(null, ['weight'], props)
  const color = t.pathOr(null, ['color'], props)
  const fontSmoothing = t.pathOr(null, ['smoothing'], props)
  const letterSpacing = t.pathOr(null, ['letterSpacing'], props)
  const lineHeight = t.pathOr(null, ['lineHeight'], props)
  const textAlignX = t.pathOr(null, ['alignX'], props)
  const textAlignY = t.pathOr(null, ['alignY'], props)
  const textDecoration = t.pathOr(null, ['decoration'], props)
  const textTransform = t.pathOr(null, ['transform'], props)
  const whitespace = t.pathOr(null, ['space'], props)
  const wordBreak = t.pathOr(null, ['break'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(
      t.omit(
        [
          'as',
          'className',
          'box',
          'size',
          'family',
          'weight',
          'color',
          'smoothing',
          'letterSpacing',
          'lineHeight',
          'alignX',
          'alignY',
          'decoration',
          'transform',
          'space',
          'break',
        ],
        props
      ),
      {
        as,
        className,
        box: t.merge(
          {
            fontSize,
            fontFamily,
            fontWeight,
            color,
            fontSmoothing,
            letterSpacing,
            lineHeight,
            textAlignX,
            textAlignY,
            textDecoration,
            textTransform,
            whitespace,
            wordBreak,
          },
          t.pathOr({}, ['box'], props)
        ),
      }
    )
  )
})

export class Text extends React.Component {
  render() {
    return renderText(this.props)
  }
}
