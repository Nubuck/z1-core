import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'

// main
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
        alignItems: t.getMatch(alignX)({
          left: 'start',
          center: 'center',
          right: 'end',
        }),
      }
    : {
        justifyContent: t.getMatch(alignX)({
          left: 'start',
          center: 'center',
          right: 'end',
        }),
      }
  const justifyProps = t.isNil(alignY)
    ? {}
    : t.eq(direction, 'vertical')
    ? {
        justifyContent: t.getMatch(alignY)({
          top: 'start',
          center: 'center',
          bottom: 'end',
        }),
      }
    : {
        alignItems: t.getMatch(alignY)({
          top: 'start',
          center: 'center',
          bottom: 'end',
        }),
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
    t.merge(t.omit(['box', 'x', 'y'], props), {
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
