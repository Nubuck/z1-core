import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from './Box'
import { Spinner } from './Spinner'
import { Icon } from './Icon'

// appearance
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
    _: {
      borderWidth: 2,
      borderColor: 'transparent',
    },
    outline: {
      borderWidth: 2,
    },
    ghostOutline: {
      borderWidth: 2,
    },
  })
)

const colorByKey = fn(t => (mode, key, colors, color) => {
  const foundColor = t.pathOr(null, [mode, key], colors || {})
  if (t.not(t.isNil(foundColor))) {
    return foundColor
  }
  const modeColor = t.pathOr(null, [mode], colors || {})
  if (t.isType(modeColor, 'string')) {
    return modeColor
  }
  if (t.isType(color, 'string')) {
    return color
  }
  return null
})

const colorsToBox = colors => {
  return {
    on: {
      bgColor: colorByKey('on', 'bg', colors),
      borderColor: colorByKey('on', 'border', colors),
      color: colorByKey('on', 'content', colors),
    },
    off: {
      bgColor: colorByKey('off', 'bg', colors),
      borderColor: colorByKey('off', 'border', colors),
      color: colorByKey('off', 'content', colors),
    },
  }
}

const renderColor = fn(t => (fill, colors, color) =>
  t.match({
    _: mode =>
      t.isType(colors, 'object')
        ? colorsToBox(colors)[mode]
        : {
            bgColor: null,
            borderColor: 'transparent',
            color: null,
          },

    ghost: mode =>
      t.eq(mode, 'off')
        ? {
            bgColor: null,
            borderColor: 'transparent',
            color: [
              null,
              { hover: colorByKey('on', 'content', colors, color) },
            ],
          }
        : {
            bgColor: null,
            borderColor: 'transparent',
            color: colorByKey('on', 'content', colors, color),
          },
    outline: mode =>
      t.eq(mode, 'off')
        ? {
            bgColor: [null, { hover: colorByKey('on', 'bg', colors, color) }],
            borderColor: [
              colorByKey('off', 'border', colors, color),
              { hover: colorByKey('on', 'border', colors, color) },
            ],
            color: [
              colorByKey('off', 'content', colors, color),
              {
                hover: colorByKey(
                  'on',
                  'content',
                  colors,
                  colorByKey('off', 'content', colors, 'white')
                ),
              },
            ],
          }
        : {
            bgColor: colorByKey('on', 'bg', colors, color),
            borderColor: colorByKey('on', 'border', colors, color),
            color: colorByKey(
              'on',
              'content',
              colors,
              'white'
            ),
          },
    solid: mode =>
      t.eq(mode, 'off')
        ? {
            bgColor: [
              colorByKey('off', 'bg', colors, color),
              { hover: colorByKey('on', 'bg', colors, color) },
            ],
            borderColor: 'transparent',
            color: [
              colorByKey('off', 'content', colors),
              { hover: colorByKey('on', 'content', colors) },
            ],
            shadow: [null, { hover: true }],
          }
        : {
            bgColor: colorByKey('on', 'bg', colors, color),
            borderColor: 'transparent',
            color: colorByKey('on', 'content', colors),
          },
    ghostOutline: mode =>
      t.eq(mode, 'off')
        ? {
            bgColor: null,
            borderColor: [
              'transparent',
              { hover: colorByKey('on', 'border', colors, color) },
            ],
            color: [
              colorByKey('off', 'content', colors, color),
              { hover: colorByKey('on', 'content', colors, color) },
            ],
          }
        : {
            bgColor: null,
            borderColor: colorByKey('on', 'border', colors, color),
            color: colorByKey('on', 'content', colors, color),
          },
    ghostSolid: mode =>
      t.eq(mode, 'off')
        ? {
            bgColor: [null, { hover: colorByKey('on', 'bg', colors, color) }],
            borderColor: 'transparent',
            color: [
              colorByKey('off', 'content', colors),
              { hover: colorByKey('on', 'content', colors) },
            ],
          }
        : {
            bgColor: colorByKey('on', 'bg', colors, color),
            borderColor: 'transparent',
            color: colorByKey('on', 'content', colors),
          },
  })(fill)
)

const buttonColor = fn(t => (fill, active, colors, color) => {
  if (t.and(t.isNil(colors), t.isNil(color))) {
    return {}
  }
  const render = renderColor(fill, colors, color)
  if (t.isType(render, 'function')) {
    return render(active ? 'on' : 'off')
  }
  return {}
})

// size
const iconSize = fn(t =>
  t.match({
    _: '3xl',
    xs: 'xl',
    sm: '2xl',
    lg: '4xl',
    xl: '5xl',
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
      width: '2.3rem',
      height: '2.3rem',
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
const buttonSpacing = fn(t =>
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
      padding: { y: 4, x: 4 },
      fontSize: '3xl',
    },
  })
)

// box
const buttonBox = {
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

// elements
const renderIcon = fn(t => (size, icon) =>
  React.createElement(
    Icon,
    t.mergeAll([{ key: 'icon', size: iconSize(size) }, t.omit(['size'], icon)])
  )
)
const renderLabel = fn(t => (isCircle, noIcon, label) =>
  React.createElement(
    Box,
    t.merge(t.omit(['text', 'children', 'box'], label), {
      key: 'label',
      box: t.mergeAll([
        {
          margin: isCircle ? 0 : noIcon ? { right: 1 } : { x: 1 },
        },
        t.pathOr({}, ['box'], label),
      ]),
    }),
    t.isNil(label.text) ? label.children || null : label.text
  )
)

// main
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
      'color',
      'loading',
      'icon',
      'label',
      'children',
      'style',
      'className',
      'transition',
    ],
    props
  )
  const el = t.pathOr('button', ['as'], props)
  const box = t.pathOr({}, ['box'], props)
  const next = t.pathOr({}, ['next'], props)
  // appearance
  const size = t.pathOr('default', ['size'], props)
  const shape = t.pathOr('normal', ['shape'], props)
  const fill = t.to.camelCase(t.pathOr('ghost', ['fill'], props))
  const style = t.pathOr({}, ['style'], props)
  const className = t.pathOr('', ['className'], props)
  const transition = t.pathOr('transition-all', ['transition'], props)
  const isCircle = t.eq(shape, 'circle')
  // brand
  const colors = t.pathOr(null, ['colors'], props)
  const color = t.pathOr(null, ['color'], props)
  // status
  const loading = t.pathOr(false, ['loading'], props)
  const disabled = t.pathOr(false, ['disabled'], props)
  // boxes
  const layout = {
    container: t.mergeAll([
      buttonBox.container,
      {
        cursor: loading ? 'wait' : disabled ? 'not-allowed' : 'pointer',
        opacity: t.and(disabled, t.not(loading)) ? 50 : 100,
      },
    ]),
    content: t.merge(buttonBox.content, {
      opacity: t.not(loading) ? 100 : 0,
      visible: t.not(loading),
      flexDirection: isCircle ? 'col' : 'row',
    }),
    spinner: t.merge(buttonBox.spinner, {
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
  const noIcon = t.isNil(nextLabel)
  const noLabel = t.isNil(icon)
  const nextChildren = isCircle
    ? t.and(noIcon, noLabel)
      ? []
      : noIcon
      ? [renderLabel(isCircle, noIcon, { text: t.head(`${nextLabel.text}`) })]
      : [renderIcon(size, nextIcon)]
    : t.concat(
        noIcon ? [] : [renderIcon(size, nextIcon)],
        noLabel ? [] : [renderLabel(isCircle, noIcon, nextLabel)]
      )
  // yield
  return React.createElement(
    Box,
    t.merge(nextProps, {
      as: el,
      box: t.mergeAll([
        layout.container,
        buttonSpacing(size),
        shapes(shape),
        fills(fill),
        buttonColor(fill, t.or(loading, disabled), colors, color),
      ]),
      next: b => b.next(box).next(next),
      className: `${
        t.isZeroLen(className) ? '' : `${className} `
      }${transition} ${shape} ${fill}`,
      style: isCircle ? t.merge(circleSize(size), style) : style,
    }),
    [
      React.createElement(
        Box,
        {
          key: 'content',
          box: t.merge(
            layout.content,
            isCircle ? {} : noLabel ? {} : { padding: { right: 1 } }
          ),
        },
        t.concat(
          nextChildren,
          t.allOf([isCircle, noIcon, noLabel])
            ? [props.children]
            : isCircle
            ? []
            : [props.children]
        )
      ),
      React.createElement(Box, { key: 'spinner-box', box: layout.spinner }, [
        React.createElement(Spinner, {
          key: 'spinner',
          size: spinnerSize(size),
          color: 'white',
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
