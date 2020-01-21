import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'
import { Spinner } from './Spinner'
import { Icon } from './Icon'

// thinks
const shapes = fn(t =>
  t.match({
    _: {},
    normal: {
      borderRadius: 'md',
    },
    square: {
      borderRadius: 'none',
    },
    pill: {
      borderRadius: { left: 'full', right: 'full' },
    },
    circle: {
      borderRadius: 'full',
      padding: 0,
    },
  })
)
const fills = fn(t =>
  t.match({
    _: {},
    ghost: {
      borderWidth: null,
    },
    outline: {
      borderWidth: 2,
    },
    solid: {
      borderWidth: null,
    },
    ghostOutline: {
      borderWidth: 2,
    },
    ghostSolid: {
      borderWidth: null,
    },
  })
)
const fillColors = {
  ghost: {
    off: {
      bg: null,
      border: null,
      content: 'blue-500',
    },
    on: {
      bg: null,
      border: null,
      content: 'pink-500',
    },
  },
  outline: {
    off: {
      bg: null,
      border: 'blue-500',
      content: 'blue-500',
    },
    on: {
      bg: 'blue-500',
      border: 'blue-500',
      content: 'white',
    },
  },
  solid: {
    off: {
      bg: 'blue-500',
      border: null,
      content: 'white',
    },
    on: {
      bg: 'blue-400',
      border: null,
      content: 'blue-900',
    },
  },
  ghostOutline: {
    off: {
      bg: null,
      border: null,
      content: 'blue-500',
    },
    on: {
      bg: null,
      border: 'blue-500',
      content: 'blue-500',
    },
  },
  ghostSolid: {
    off: {
      bg: null,
      border: null,
      content: 'blue-500',
    },
    on: {
      bg: 'blue-500',
      border: null,
      content: 'white',
    },
  },
}

// main
const iconSize = fn(t =>
  t.match({
    _: '2xl',
    xs: 'lg',
    sm: 'xl',
    lg: '3xl',
    xl: '4xl',
  })
)
const spinnerSize = fn(t =>
  t.match({
    _: 'default',
    lg: 'sm',
    xl: 'sm',
  })
)
const circleSize = fn(t =>
  t.match({
    _: {
      width: '2.5rem',
      height: '2.5rem',
    },
    xs: {
      width: '1.95rem',
      height: '1.95rem',
    },
    sm: {
      width: '2.2rem',
      height: '2.2rem',
    },
    lg: {
      width: '2.9rem',
      height: '2.9rem',
    },
    xl: {
      width: '3.25rem',
      height: '3.25rem',
    },
  })
)

const buttonSize = fn(t =>
  t.match({
    _: {
      padding: { y: 2, x: 3 },
      fontSize: 'lg',
    },
    xs: {
      padding: { y: 1, x: 2 },
      fontSize: 'sm',
    },
    sm: {
      padding: { y: 1, x: 2 },
      fontSize: 'md',
    },
    lg: {
      padding: { y: 3, x: 3 },
      fontSize: '2xl',
    },
    xl: {
      padding: { y: 3, x: 4 },
      fontSize: '3xl',
      fontWeight: 'medium',
    },
  })
)

const elBox = {
  container: {
    position: 'relative',
    display: 'flex',
    overflow: 'hidden',
    outline: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    display: 'flex',
    alignSelf: 'stretch',
    zIndex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 'auto',
    lineHeight: 'none',
    height: 'full',
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
  },
}

const iconElement = fn(t => (size, nextIcon) =>
  React.createElement(
    Icon,
    t.mergeAll([
      { key: 'icon', size: iconSize(size) },
      t.omit(['size'], nextIcon),
    ])
  )
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
      'style',
      'className',
    ],
    props
  )
  const as = t.pathOr('button', ['as'], props)
  const box = t.pathOr({}, ['box'], props)
  const next = t.pathOr({}, ['next'], props)
  // appearance
  const size = t.pathOr('default', ['size'], props)
  const colors = t.pathOr({}, ['colors'], props)
  const off = t.pathOr(null, ['off'], colors)
  const on = t.pathOr(null, ['on'], colors)
  const shape = t.pathOr('normal', ['shape'], props)
  const fill = t.pathOr('ghost', ['fill'], props)
  const style = t.pathOr({}, ['style'], props)
  const className = t.pathOr('', ['className'], props)
  // status
  const loading = t.pathOr(false, ['loading'], props)
  const disabled = t.pathOr(false, ['disabled'], props)
  // boxes
  const layout = {
    container: t.mergeAll([
      elBox.container,
      {
        cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer',
        opacity: t.and(disabled, t.not(loading)) ? 50 : 100,
      },
    ]),
    content: t.merge(elBox.content, {
      opacity: t.not(loading) ? 100 : 0,
      visible: t.not(loading),
      flexDirection: t.eq(shape, 'circle') ? 'col' : 'row',
    }),
    spinner: t.merge(elBox.spinner, {
      opacity: loading ? 100 : 0,
      visible: loading,
    }),
  }

  // elements
  const icon = t.pathOr(null, ['icon'], props)
  const label = t.pathOr(null, ['label'], props)
  const nextIcon = t.isNil(icon)
    ? null
    : t.isType(icon, 'string')
    ? { name: icon }
    : icon
  const nextLabel = t.isNil(label)
    ? null
    : t.isType(label, 'string')
    ? { text: label }
    : label
  const nextChildren = t.eq(shape, 'circle')
    ? t.and(t.isNil(nextIcon), t.isNil(nextLabel))
      ? []
      : t.isNil(nextIcon)
      ? [t.head(`${nextLabel.text}`)]
      : [iconElement(size, nextIcon)]
    : t.concat(
        t.isNil(nextIcon) ? [] : [iconElement(size, nextIcon)],
        t.isNil(nextLabel)
          ? []
          : [
              React.createElement(
                Box,
                t.merge(t.omit(['text', 'children', 'box'], nextLabel), {
                  key: 'label',
                  box: t.mergeAll([
                    {
                      margin: t.eq(shape, 'circle')
                        ? 0
                        : t.isNil(nextIcon)
                        ? { right: 1 }
                        : { x: 1 },
                    },
                    t.pathOr({}, ['box'], nextLabel),
                  ]),
                }),
                t.isNil(nextLabel.text)
                  ? nextLabel.children || null
                  : nextLabel.text
              ),
            ]
      )
  return React.createElement(
    Box,
    t.merge(nextProps, {
      as,
      box: t.mergeAll([
        layout.container,
        buttonSize(size),
        shapes(shape),
        fills(fill),
      ]),
      next: b => b.next(box).next(next),
      className: `${
        t.isZeroLen(className) ? '' : `${className} `
      }${shape} ${fill}`,
      style: t.eq(shape, 'circle') ? t.merge(circleSize(size), style) : style,
    }),
    [
      React.createElement(Box, {
        key: 'content',
        box: layout.content,
        children: t.concat(
          nextChildren,
          t.isZeroLen(nextChildren) ? [props.children] : []
        ),
        // style: t.eq(shape, 'circle') ? circleSize(size) : {},
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
Button.displayName = 'Button'
// const matchShape = fn(t =>
//   t.match({
//     pill(props) {
//       return {}
//     },
//     circle(props) {
//       return {}
//     },
//     square(props) {
//       return {}
//     },
//     _(props) {
//       return {}
//     },
//   })
// )

// const matchFill = fn(t => (fill = '') =>
//   t.match({
//     outline(props) {
//       return {}
//     },
//     solid(props) {
//       return {}
//     },
//     ghostOutline(props) {
//       return {}
//     },
//     ghostSolid(props) {
//       return {}
//     },
//     _(props) {},
//   })(t.to.camelCase(fill))
// )
