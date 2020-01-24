import React from 'react'
import { uiBox, fn } from '@z1/lib-ui-box'

// main
export const renderBox = fn(t => (props, otherChildren) => {
  const Element = t.pathOr('div', ['as'], props)
  const box = t.pathOr(null, ['box'], props)
  const next = t.pathOr(null, ['next'], props)
  const stretch = t.pathOr(null, ['stretch'], props)
  const uiProps = t.pick(uiBox.keys, props)
  const children = t.pathOr(otherChildren, ['children'], props)
  const nextProps = t.omit(
    t.uniq(
      t.concat(
        ['as', 'box', 'className', 'stretch', 'next', 'children'],
        uiBox.keys
      )
    ),
    props
  )
  const className = t.allOf([
    t.isNil(box),
    t.isNil(stretch),
    t.isNil(next),
    t.isZeroLen(t.keys(uiProps)),
  ])
    ? t.pathOr('', ['className'], props)
    : uiBox
        .create(box || {})
        .next(
          t.isNil(stretch)
            ? {}
            : {
                alignSelf: 'stretch',
                flex: 'auto',
              }
        )
        .next({
          className: t.pathOr(
            t.pathOr('', ['className'], box || {}),
            ['className'],
            props
          ),
        })
        .next(t.omit(['className'], uiProps || {}))
        .next(next || {})
        .toCss()
  return React.createElement(
    Element,
    t.merge(nextProps, { className }),
    children
  )
})

export class Box extends React.Component {
  render() {
    return renderBox(this.props)
  }
}
Box.displayName = 'Box'
