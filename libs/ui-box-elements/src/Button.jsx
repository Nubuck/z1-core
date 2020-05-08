import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderBox } from './Box'
import { Spinner } from './Spinner'
import { Icon } from './Icon'

// appearance
const shapes = fn((t) =>
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
const fills = fn((t) =>
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

const colorByKey = fn((t) => (mode, key, fill, colors, color) => {
  const foundColor = t.pathOr(null, [mode, key], colors || {})
  if (t.notNil(foundColor)) {
    return foundColor
  }
  const modeColor = t.atOr(null, mode, colors || {})
  if (
    t.and(
      t.isType(modeColor, 'string'),
      t.not(
        t.allOf([
          t.or(t.includes('outline', fill), t.includes('solid', fill)),
          t.and(t.eq(key, 'content'), t.eq(mode, 'on')),
        ])
      )
    )
  ) {
    return modeColor
  }
  if (t.isType(color, 'string')) {
    return color
  }
  return null
})

const colorsToBox = (fill, colors) => {
  return {
    on: {
      bgColor: colorByKey('on', 'bg', fill, colors),
      borderColor: colorByKey('on', 'border', fill, colors),
      color: colorByKey('on', 'content', fill, colors),
    },
    off: {
      bgColor: colorByKey('off', 'bg', fill, colors),
      borderColor: colorByKey('off', 'border', fill, colors),
      color: colorByKey('off', 'content', fill, colors),
    },
  }
}

const renderColor = fn((t) => (fill, colors, color) =>
  t.match({
    _: (mode) =>
      t.isType(colors, 'object')
        ? colorsToBox(fill, colors)[mode]
        : {
            bgColor: null,
            borderColor: 'transparent',
            color: null,
          },

    ghost: (mode) =>
      t.eq(mode, 'off')
        ? {
            bgColor: null,
            borderColor: 'transparent',
            color: [
              colorByKey('off', 'content', fill, colors, color),
              { hover: colorByKey('on', 'content', fill, colors, color) },
            ],
          }
        : {
            bgColor: null,
            borderColor: 'transparent',
            color: colorByKey('on', 'content', fill, colors, color),
          },
    outline: (mode) =>
      t.eq(mode, 'off')
        ? {
            bgColor: [
              null,
              { hover: colorByKey('on', 'bg', fill, colors, color) },
            ],
            borderColor: [
              colorByKey('off', 'border', fill, colors, color),
              { hover: colorByKey('on', 'border', fill, colors, color) },
            ],
            color: [
              colorByKey('off', 'content', fill, colors, color),
              {
                hover: colorByKey(
                  'on',
                  'content',
                  fill,
                  colors,
                  colorByKey('on', 'content', fill, colors, 'white')
                ),
              },
            ],
          }
        : {
            bgColor: colorByKey('on', 'bg', fill, colors, color),
            borderColor: colorByKey('on', 'border', fill, colors, color),
            color: colorByKey('on', 'content', fill, colors, 'white'),
          },
    solid: (mode) =>
      t.eq(mode, 'off')
        ? {
            bgColor: [
              colorByKey('off', 'bg', fill, colors, color),
              { hover: colorByKey('on', 'bg', fill, colors, color) },
            ],
            borderColor: 'transparent',
            color: [
              colorByKey('off', 'content', fill, colors),
              { hover: colorByKey('on', 'content', fill, colors, 'white') },
            ],
            shadow: [null, { hover: true }],
          }
        : {
            bgColor: colorByKey('on', 'bg', fill, colors, color),
            borderColor: 'transparent',
            color: colorByKey('on', 'content', fill, colors, 'white'),
          },
    ghostOutline: (mode) =>
      t.eq(mode, 'off')
        ? {
            bgColor: null,
            borderColor: [
              'transparent',
              { hover: colorByKey('on', 'border', fill, colors, color) },
            ],
            color: [
              colorByKey('off', 'content', fill, colors, color),
              { hover: colorByKey('on', 'content', fill, colors, color) },
            ],
          }
        : {
            bgColor: null,
            borderColor: colorByKey('on', 'border', fill, colors, color),
            color: colorByKey('on', 'content', fill, colors, color),
          },
    ghostSolid: (mode) =>
      t.eq(mode, 'off')
        ? {
            bgColor: [
              null,
              { hover: colorByKey('on', 'bg', fill, colors, color) },
            ],
            borderColor: 'transparent',
            color: [
              colorByKey('off', 'content', fill, colors, color),
              { hover: colorByKey('on', 'content', fill, colors, 'white') },
            ],
          }
        : {
            bgColor: colorByKey('on', 'bg', fill, colors, color),
            borderColor: 'transparent',
            color: colorByKey('on', 'content', fill, colors, 'white'),
          },
  })(fill)
)

const buttonColor = fn((t) => (fill, active, colors, color) => {
  if (t.and(t.isNil(fill, colors), t.isNil(color))) {
    return {}
  }
  const render = renderColor(fill, colors, color)
  if (t.isType(render, 'function')) {
    return render(active ? 'on' : 'off')
  }
  return {}
})

// size
const iconSize = fn((t) =>
  t.match({
    _: '3xl',
    xs: 'xl',
    sm: '2xl',
    lg: '4xl',
    xl: '4xl',
  })
)
const spinnerSize = fn((t) =>
  t.match({
    _: 'default',
    lg: 'sm',
    xl: 'sm',
  })
)
const circleSize = fn((t) =>
  t.match({
    _: {
      width: '2.5rem',
      height: '2.5rem',
    },
    xs: {
      width: '2rem',
      height: '2rem',
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
const buttonSpacing = fn((t) => (size) =>
  t.match({
    _: {
      padding: { top: 1, bottom: 1, x: 2 },
      fontSize: 'lg',
    },
    xs: {
      padding: { top: 1, bottom: 1, x: 2 },
      fontSize: 'sm',
    },
    sm: {
      padding: { top: 1, bottom: 1, x: 2 },
      fontSize: 'md',
    },
    lg: {
      padding: { top: 2, bottom: 2, x: 3 },
      fontSize: '2xl',
    },
    xl: {
      padding: { top: 3, bottom: 3, x: 3 },
      fontSize: '3xl',
    },
  })(size)
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
const renderIcon = fn((t) => (size, icon) =>
  React.createElement(
    Icon,
    t.mergeAll([{ key: 'icon', size: iconSize(size) }, t.omit(['size'], icon)])
  )
)
const Label = fn((t) => ({ isCircle, noIcon, text, children, ...props }) =>
  renderBox(
    t.merge(t.omit(['text', 'children', 'box'], props), {
      key: 'label',
      box: t.mergeAll([
        {
          display: 'flex',
          margin: isCircle ? 0 : { x: 1 },
        },
        t.atOr({}, 'box', props),
      ]),
    }),
    t.isNil(text) ? children || null : text
  )
)
Label.displayName = 'Label'

// main
export const renderButton = fn((t) => (props) => {
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
      'disabled',
      'selected',
      'mode',
      'icon',
      'label',
      'children',
      'style',
      'className',
      'transition',
      'reverse',
      'slots',
    ],
    props
  )
  const el = t.atOr('button', 'as', props)
  const box = t.atOr({}, 'box', props)
  const next = t.atOr({}, 'next', props)
  // appearance
  const size = t.atOr('default', 'size', props)
  const shape = t.atOr('normal', 'shape', props)
  const fill = t.to.camelCase(t.atOr('ghost', 'fill', props))
  const style = t.atOr({}, 'style', props)
  const className = t.atOr('', 'className', props)
  const transition = t.atOr('colors', 'transition', props)
  const isCircle = t.eq(shape, 'circle')
  // brand
  const colors = t.atOr(null, 'colors', props)
  const color = t.atOr(null, 'color', props)
  // status
  const loading = t.atOr(false, 'loading', props)
  const disabled = t.atOr(false, 'disabled', props)
  const selected = t.atOr(false, 'selected', props)
  const mode = t.atOr('active', 'mode', props)
  const inactive = t.neq(mode, 'active')
  // modifiers
  const reverse = t.atOr(false, 'reverse', props)
  // slots
  const slots = t.atOr({}, 'slots', props)
  const contentSlot = t.atOr({}, 'content', slots)
  const spinnerSlot = t.atOr({}, 'spinner', slots)
  // boxes
  const layout = {
    container: t.mergeAll([
      buttonBox.container,
      {
        cursor: loading
          ? 'wait'
          : disabled
          ? 'not-allowed'
          : inactive
          ? 'default'
          : 'pointer',
        opacity: t.and(disabled, t.not(loading)) ? 50 : 100,
        transition,
      },
    ]),
    content: t.mergeAll([
      buttonBox.content,
      {
        opacity: t.not(loading) ? 100 : 0,
        visible: t.not(loading),
        flexDirection: isCircle ? 'col' : reverse ? 'row-reverse' : 'row',
      },
      contentSlot,
    ]),
    spinner: t.mergeAll([
      buttonBox.spinner,
      {
        opacity: loading ? 100 : 0,
        visible: loading,
      },
      spinnerSlot,
    ]),
  }
  // elements
  const icon = t.atOr(null, 'icon', props)
  const label = t.atOr(null, 'label', props)
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
  const noIcon = t.isNil(nextIcon)
  const noLabel = t.isNil(nextLabel)
  const nextChildren = isCircle
    ? t.and(noIcon, noLabel)
      ? []
      : noIcon
      ? [
          React.createElement(Label, {
            key: 'label',
            isCircle,
            noIcon,
            text: t.to.constantCase(t.head(`${nextLabel.text || ''}`)),
          }),
        ]
      : [renderIcon(size, nextIcon)]
    : t.concat(
        noIcon ? [] : [renderIcon(size, nextIcon)],
        noLabel
          ? []
          : [
              React.createElement(
                Label,
                t.merge(
                  {
                    key: 'label',
                    isCircle,
                    noIcon,
                  },
                  nextLabel
                )
              ),
            ]
      )
  // yield
  return renderBox(
    t.merge(nextProps, {
      as: el,
      box: t.mergeAll([
        layout.container,
        buttonSpacing(size),
        shapes(shape),
        fills(fill),
        buttonColor(
          fill,
          t.anyOf([loading, inactive, selected]),
          colors,
          color
        ),
      ]),
      next: (b) => b.next(box).next(next),
      className: `${t.noLen(className) ? '' : `${className} `}${shape} ${fill}`,
      style: isCircle ? t.merge(circleSize(size), style) : style,
      disabled: loading ? true : disabled,
    }),
    [
      renderBox(
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
      renderBox(
        {
          key: 'spinner-box',
          box: layout.spinner,
        },
        [
          React.createElement(Spinner, {
            key: 'spinner',
            size: spinnerSize(size),
            color: colorByKey(
              'on',
              'content',
              fill,
              colors,
              t.or(
                t.and(
                  t.eq(fill, 'outline'),
                  t.anyOf([loading, disabled, inactive])
                ),
                t.includes('solid', t.to.lowerCase(fill))
              )
                ? 'white'
                : color || 'white'
            ),
          }),
        ]
      ),
    ]
  )
})

export class Button extends React.Component {
  render() {
    return renderButton(this.props)
  }
}
Button.displayName = 'Button'
