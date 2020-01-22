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
const fills = fn(t => fill =>
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
  })(fill)
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

const colorsToBox = fn(t => colors => {
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
})

const buttonColor = fn(t => (fill, active, colors, color) => {
  if (t.and(t.isNil(colors), t.isNil(color))) {
    return {}
  }
  console.log('BUTTON COLOR', fill, active, colors, color)
  return t.match({
    _: t.isType(colors, 'object')
      ? colorsToBox(colors)
      : {
          on: {
            bgColor: null,
            borderColor: null,
            color: null,
          },
          off: {
            bgColor: null,
            borderColor: null,
            color: null,
          },
        },
    ghost: {
      off: {
        bgColor: null,
        borderColor: null,
        color: [null, { hover: colorByKey('on', 'content', colors, color) }],
      },
      on: {
        bgColor: null,
        borderColor: null,
        color: colorByKey('on', 'content', colors, color),
      },
    },
    outline: {
      off: {
        bgColor: [null, { hover: colorByKey('on', 'bg', colors, color) }],
        borderColor: colorByKey('off', 'border', colors, color),
        color: colorByKey('off', 'content', colors),
      },
      on: {
        bgColor: colorByKey('on', 'bg', colors, color),
        borderColor: colorByKey('on', 'border', colors, color),
        color: colorByKey(
          'on',
          'content',
          colors,
          colorByKey('off', 'content', colors)
        ),
      },
    },
    solid: {
      off: {
        bgColor: colorByKey('off', 'bg', colors, color),
        borderColor: null,
        color: colorByKey('off', 'content', colors),
        shadow: [null, { hover: true }],
      },
      on: {
        bgColor: colorByKey('on', 'bg', colors, color),
        borderColor: null,
        color: colorByKey('on', 'content', colors),
      },
    },
    ghostOutline: {
      off: {
        bgColor: null,
        borderColor: [
          'transparent',
          { hover: colorByKey('on', 'border', colors, color) },
        ],
        color: [null, { hover: colorByKey('on', 'content', colors, color) }],
      },
      on: {
        bgColor: null,
        borderColor: colorByKey('on', 'border', colors, color),
        color: colorByKey('on', 'content', colors, color),
      },
    },
    ghostSolid: {
      off: {
        bgColor: [null, { hover: colorByKey('on', 'bg', colors, color) }],
        borderColor: null,
        color: [
          colorByKey('off', 'content', colors),
          { hover: colorByKey('on', 'content', colors) },
        ],
      },
      on: {
        bgColor: colorByKey('on', 'bg', colors, color),
        borderColor: null,
        color: colorByKey('on', 'content', colors),
      },
    },
  })(fill)[active ? 'on' : 'off']
})

// size
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
  const as = t.pathOr('button', ['as'], props)
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
      as,
      box: t.mergeAll([
        layout.container,
        buttonSize(size),
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
