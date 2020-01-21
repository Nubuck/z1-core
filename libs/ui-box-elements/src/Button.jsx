import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'
import { Spinner } from './Spinner'
import { Icon } from './Icon'

// main
const iconSize = fn(t =>
  t.match({
    xs: {
      fontSize: 'md',
    },
    sm: {
      fontSize: 'lg',
    },
    lg: {
      fontSize: '2xl',
    },
    xl: {
      fontSize: '3xl',
    },
    _: {
      fontSize: 'xl',
    },
  })
)
const matchShape = fn(t =>
  t.match({
    pill(props) {
      return {}
    },
    circle(props) {
      return {}
    },
    _(props) {
      return {}
    },
  })
)
const matchFill = fn(t => (fill = '') =>
  t.match({
    outline(props) {
      return {}
    },
    outlineGhost(props) {
      return {}
    },
    ghostprops() {
      return {}
    },
    _(props) {},
  })(t.to.camelCase(fill))
)
const matchSize = fn(t =>
  t.match({
    xs(props) {
      return {
        padding: 1,
        fontSize: 'sm',
      }
    },
    sm(props) {
      return {
        padding: 1,
        fontSize: 'md',
      }
    },
    lg(props) {
      return {
        padding: 3,
        fontSize: 'lg',
      }
    },
    xl(props) {
      return {
        padding: 3,
        fontSize: 'xl',
      }
    },
    _(props) {
      return {
        padding: 2,
        fontSize: 'md',
      }
    },
  })
)
const renderButton = fn(t => props => {
  const nextProps = t.omit(
    [
      'as',
      'size',
      'shape',
      'fill',
      'colors',
      'loading',
      'slots',
      'children',
      'box',
      'next',
    ],
    props
  )
  const as = t.pathOr('button', ['as'], props)
  const box = t.pathOr({}, ['box'], props)
  const next = t.pathOr({}, ['next'], props)
  // appearance
  const size = t.pathOr('md', ['size'], props)
  const shape = t.pathOr('normal', ['shape'], props)
  const fill = t.pathOr('solid', ['fill'], props)
  const colors = t.pathOr(null, ['colors'], props)
  // status
  const loading = t.pathOr(false, ['loading'], props)
  const disabled = t.pathOr(false, ['disabled'], props)
  // elements
  const slots = t.pathOr(null, ['slots'], props)
  const layout = {
    container: {
      position: 'relative',
      display: 'inline-flex',
      cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer',
    },
    content: {
      position: 'relative',
      display: 'flex',
      alignSelf: 'stretch',
      zIndex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: loading ? 0 : 100,
      visible: t.not(loading),
    },
    spinner: {
      position: 'absolute',
      zIndex: 10,
      pin: { top: true, right: true, bottom: true, left: true },
      display: 'flex',
      alignSelf: 'stretch',
      flexDirection: 'col',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: loading ? 100 : 0,
      visible: loading,
    },
  }
  const nextChildren = t.isNil(slots)
    ? props.children
    : t.concat(
        t.has('icon')(slots)
          ? [
              React.createElement(
                Icon,
                t.mergeAll([
                  { key: 'icon' },
                  {
                    box: t.merge(
                      {
                        fontSize: iconSize(size),
                      },
                      t.omit(['box'], slots.icon)
                    ),
                  },
                  slots.icon,
                ])
              ),
            ]
          : [],
        t.has('text')(slots)
          ? [
              React.createElement(
                Box,
                t.merge(t.omit(['value', 'children'], slots.text), {
                  key: 'text',
                  children: [
                    React.createElement('span', {
                      key: 'text-value',
                      children: [
                        `${slots.text.value || slots.text.children || ''}`,
                      ],
                    }),
                  ],
                })
              ),
            ]
          : []
      )
  return React.createElement(
    Box,
    t.merge(nextProps, {
      as,
      box: layout.container,
      next: b => b.next(box).next(next),
    }),
    [
      React.createElement(Box, {
        key: 'content',
        box: t.mergeAll([layout.content, matchSize(size)({})]),
        children: nextChildren,
      }),
      React.createElement(Box, { key: 'spinner-box', box: layout.spinner }, [
        React.createElement(Spinner, { key: 'spinner', size: 'default' }),
      ]),
    ]
  )
})

export class Button extends React.Component {
  render() {
    return renderButton(this.props)
  }
}
