import React from 'react'
import z from '@z1/lib-feature-box'
import { Row } from '@z1/lib-ui-box-elements'

// main
export const isRenderProp = z.fn(t => prop =>
  t.isNil(prop) ? false : t.isType(prop, 'function')
)
const textProps = {
  x: 'left',
  y: 'center',
  box: {
    display: 'inline-flex',
    alignSelf: 'auto',
    lineHeight: 'tight',
    wordBreak: 'truncate',
  },
}
export const renderText = z.fn(t => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(textProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  if (t.isType(props, 'string')) {
    return <Row {...defaultProps}>{props}</Row>
  }
  const text = t.atOr(null, 'text', props)
  if (t.notNil(text)) {
    const nextProps = t.omit(['text'], props)
    return (
      <Row {...defaultProps} {...nextProps}>
        {text}
      </Row>
    )
  }
  const nextProps = t.omit(['children'], props)
  return (
    <Row {...defaultProps} {...nextProps}>
      {props.children}
    </Row>
  )
})

