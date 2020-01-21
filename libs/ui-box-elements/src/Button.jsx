import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'
import { Spinner } from './Spinner'
import { Icon } from './Icon'

// main
const iconSize = fn(t =>
  t.match({
    xs: 'md',
    sm: 'lg',
    lg: '2xl',
    xl: '3xl',
    _: 'xl',
  })
)
const spinnerSize = fn(t =>
  t.match({
    lg: 'sm',
    xl: 'sm',
    _: 'default',
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
    square(props) {
      return {}
    },
    _(props) {
      return {}
    },
  })
)
const xc = {
  bg: [null, { hover: 'blue-500' }],
  border: null,
  content: ['blue-500', { hover: 'white' }],
  spinner: 'blue',
}
const matchFill = fn(t => (fill = '') =>
  t.match({
    outline(props) {
      return {}
    },
    solid(props) {
      return {}
    },
    ghostOutline(props) {
      return {}
    },
    ghostSolid(props) {
      return {}
    },
    _(props) {},
  })(t.to.camelCase(fill))
)
const matchSize = fn(t =>
  t.match({
    xs(props) {
      return {
        padding: { y: 1, x: 2 },
        fontSize: 'sm',
      }
    },
    sm(props) {
      return {
        padding: { y: 1, x: 2 },
        fontSize: 'md',
      }
    },
    lg(props) {
      return {
        padding: { y: 3, x: 3 },
        fontSize: 'xl',
      }
    },
    xl(props) {
      return {
        padding: { y: 3, x: 4 },
        fontSize: '2xl',
      }
    },
    _(props) {
      return {
        padding: { y: 2, x: 3 },
        fontSize: 'lg',
      }
    },
  })
)
const renderButton = fn(t => props => {
  const nextProps = t.omit(
    [
      'as',
      'box',
      'next',
      'size',
      'shape',
      'fill',
      'colors',
      'loading',
      'icon',
      'label',
      'children',
    ],
    props
  )
  const as = t.pathOr('button', ['as'], props)
  const box = t.pathOr({}, ['box'], props)
  const next = t.pathOr({}, ['next'], props)
  // appearance
  const size = t.pathOr('default', ['size'], props)
  const shape = t.pathOr('normal', ['shape'], props)
  const fill = t.pathOr('solid', ['fill'], props)
  const colors = t.pathOr(null, ['colors'], props)
  // status
  const loading = t.pathOr(false, ['loading'], props)
  const disabled = t.pathOr(false, ['disabled'], props)
  // elements
  const icon = t.pathOr(null, ['icon'], props)
  const label = t.pathOr(null, ['label'], props)
  // boxes
  const layout = {
    container: {
      position: 'relative',
      display: 'inline-flex',
      overflow: 'hidden',
      outline: 'none',
      cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer',
      opacity: t.and(disabled, t.not(loading)) ? 50 : 100,
      bgColor: xc.bg,
      borderColor: xc.border,
    },
    content: {
      position: 'relative',
      display: 'flex',
      alignSelf: 'stretch',
      zIndex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: t.not(loading) ? 100 : 0,
      visible: t.not(loading),
      color: xc.content,
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
  const nextChildren = t.and(t.isNil(icon), t.isNil(label))
    ? props.children
    : t.concat(
        t.isNil(icon)
          ? []
          : [
              React.createElement(
                Icon,
                t.mergeAll([
                  { key: 'icon', size: iconSize(size) },
                  t.omit(['size'], icon),
                ])
              ),
            ],
        t.isNil(label)
          ? []
          : [
              React.createElement(
                Box,
                t.merge(t.omit(['text', 'children', 'box'], label), {
                  key: 'label',
                  box: t.mergeAll([
                    {
                      margin: t.isNil(icon) ? null : { x: 1 },
                    },
                    t.pathOr({}, ['box'], icon),
                  ]),
                  children: [
                    React.createElement('span', {
                      key: 'label-text',
                      children: t.isNil(label.text)
                        ? label.children || []
                        : [label.text],
                    }),
                  ],
                })
              ),
            ]
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
        React.createElement(Spinner, {
          key: 'spinner',
          size: spinnerSize(size),
        }),
      ]),
    ]
  )
})

export class Button extends React.Component {
  render() {
    return renderButton(this.props)
  }
}
