import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderBox } from './Box'

// main
const matchX = fn(t =>
  t.match({ left: 'start', center: 'center', right: 'end' })
)
const matchY = fn(t =>
  t.match({ top: 'start', center: 'center', bottom: 'end' })
)
export const renderStack = fn(t => (direction, props) => {
  const stackProps = {
    flexDirection: t.eq(direction, 'vertical') ? 'col' : 'row',
  }
  const alignX = t.atOr(null, 'x', props)
  const alignY = t.atOr(null, 'y', props)
  const alignProps = t.isNil(alignX)
    ? {}
    : t.eq(direction, 'vertical')
    ? {
        flex: 'auto',
        alignItems: matchX(alignX),
      }
    : {
        justifyContent: matchX(alignX),
      }
  const justifyProps = t.isNil(alignY)
    ? {}
    : t.eq(direction, 'vertical')
    ? {
        justifyContent: matchY(alignY),
      }
    : {
        alignItems: matchY(alignY),
      }
  const stretch = t.atOr(null, 'stretch', props)
  const stretchProps = t.isNil(stretch)
    ? {}
    : t.eq(direction, 'vertical')
    ? {
        height: 'full',
      }
    : {}
  return renderBox(
    t.merge(t.omit(['box', 'x', 'y', 'direction'], props), {
      box: t.merge(
        t.mergeAll([
          {
            display: 'flex',
            alignSelf: 'stretch',
          },
          stackProps,
          alignProps,
          justifyProps,
          stretchProps,
        ]),
        t.atOr({}, 'box', props)
      ),
    })
  )
})
const colWidth = fn(t => width =>
  t.isNil(width) ? width : t.gte(width, 12) ? 'full' : `${width}/12`
)
export const renderResponsiveStack = fn(t => (direction, props) => {
  const sm = colWidth(t.atOr(null, 'sm', props))
  const md = colWidth(t.atOr(null, 'md', props))
  const lg = colWidth(t.atOr(null, 'lg', props))
  const xl = colWidth(t.atOr(null, 'xl', props))
  return renderStack(
    direction,
    t.merge(t.omit(['box', 'xs', 'sm', 'md', 'lg', 'xl'], props), {
      box: t.allOf([t.isNil(sm), t.isNil(md), t.isNil(lg), t.isNil(xl)])
        ? t.at('box', props)
        : t.merge(
            {
              flex: 'none',
              width: [
                colWidth(t.atOr(null, 'xs', props)),
                t.mergeAll([
                  t.isNil(sm) ? {} : { sm },
                  t.isNil(md) ? {} : { md },
                  t.isNil(lg) ? {} : { lg },
                  t.isNil(xl) ? {} : { xl },
                ]),
              ],
            },
            t.atOr({}, 'box', props)
          ),
    })
  )
})

export class Stack extends React.Component {
  render() {
    return renderStack(this.props.direction, this.props)
  }
}
Stack.displayName = 'Stack'

export class VStack extends React.Component {
  render() {
    return renderStack('vertical', this.props)
  }
}
VStack.displayName = 'VStack'

export class HStack extends React.Component {
  render() {
    return renderStack('horizontal', this.props)
  }
}
HStack.displayName = 'HStack'
