import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'

// main
const matchX = fn(t =>
  t.match({ left: 'start', center: 'center', right: 'end' })
)
const matchY = fn(t =>
  t.match({ top: 'start', center: 'center', bottom: 'end' })
)
const renderStack = fn(t => (direction, props) => {
  const stackProps = {
    flexDirection: t.eq(direction, 'vertical') ? 'col' : 'row',
  }
  const alignX = t.pathOr(null, ['x'], props)
  const alignY = t.pathOr(null, ['y'], props)
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
  const stretch = t.pathOr(null, ['stretch'], props)
  const stretchProps = t.isNil(stretch)
    ? {}
    : t.eq(direction, 'vertical')
    ? {
        height: 'full',
      }
    : {}
  return React.createElement(
    Box,
    t.merge(t.omit(['box', 'x', 'y', 'direction'], props), {
      box: t.mergeAll([
        {
          display: 'flex',
          alignSelf: 'stretch',
        },
        stackProps,
        alignProps,
        justifyProps,
        stretchProps,
        t.pathOr({}, ['box'], props),
      ]),
    })
  )
})

export class Stack extends React.Component {
  render() {
    return renderStack(this.props.direction, this.props)
  }
}

export class VStack extends React.Component {
  render() {
    return renderStack('vertical', this.props)
  }
}

export class HStack extends React.Component {
  render() {
    return renderStack('horizontal', this.props)
  }
}
