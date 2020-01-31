import React from 'react'
import { uiBox, fn } from '@z1/lib-ui-box'

// main
export const renderBox = fn(t => (props, otherChildren) => {
  const Element = t.atOr('div', 'as', props)
  const box = t.atOr(null, 'box', props)
  const next = t.atOr(null, 'next', props)
  const stretch = t.atOr(null, 'stretch', props)
  const uiProps = t.pick(uiBox.keys, props)
  const children = t.atOr(otherChildren, 'children', props)
  const nextProps = t.omit(
    t.uniq(
      t.concat(
        ['as', 'box', 'className', 'stretch', 'next', 'children'],
        uiBox.keys
      )
    ),
    props
  )
  const elClassName = t.atOr('', 'className', props)
  const className = t.allOf([
    t.isNil(box),
    t.isNil(stretch),
    t.isNil(next),
    t.noLen(t.keys(uiProps)),
  ])
    ? elClassName
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
        .next(t.omit(['className'], uiProps || {}))
        .next(t.noLen(elClassName) ? {} : { className: elClassName })
        .next(next || {})
        .toCss()
  const boxProps = t.merge(nextProps, { className })
  return React.createElement(Element, boxProps, children)
})

export class Box extends React.Component {
  render() {
    return renderBox(this.props)
  }
}
Box.displayName = 'Box'
