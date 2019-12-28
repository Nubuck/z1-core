import React from 'react'
import { uiBox, fn } from '@z1/lib-ui-box-tailwind'

// main
const renderBox = fn(t => props => {
  const Element = t.pathOr('div', ['as'], props)
  const box = t.pathOr(null, ['box'], props)
  const next = t.pathOr(null, ['next'], props)
  const stretch = t.pathOr(null, ['stretch'], props)
  return React.createElement(
    Element,
    t.merge(t.omit(['as', 'box', 'className', 'stretch', 'next'], props), {
      className: t.and(t.and(t.isNil(box), t.isNil(stretch)), t.isNil(next))
        ? t.pathOr('', ['className'], props)
        : uiBox(box || {})
            .next(
              t.isNil(stretch)
                ? {}
                : {
                    alignSelf: 'stretch',
                    flex: 'auto',
                  }
            )
            .next({
              className: t.pathOr(box.className || '', ['className'], props),
            })
            .next(next || {})
            .toCss(),
    })
  )
})

export class Box extends React.Component {
  render() {
    return renderBox(this.props)
  }
}
