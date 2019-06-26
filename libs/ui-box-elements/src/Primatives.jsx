import React from 'react'
import { task } from '@z1/preset-task'
import { uiBox } from '@z1/lib-ui-box-tailwind'

// Box
export const Box = task(t => props => {
  const Element = t.pathOr('div', ['as'], props)
  const box = t.pathOr(null, ['box'], props)
  const stretch = t.pathOr(null, ['stretch'], props)
  const stretchProps = t.isNil(stretch)
    ? {}
    : {
        alignSelf: 'stretch',
        flex: 'auto',
      }
  return React.createElement(
    Element,
    t.merge(t.omit(['as', 'box', 'className', 'stretch'], props), {
      className: t.and(t.isNil(box), t.isNil(stretch))
        ? t.pathOr('', ['className'], props)
        : uiBox(box || {})
            .next(stretchProps)
            .next({
              className: t.pathOr(box.className || '', ['className'], props),
            })
            .toCss(),
    })
  )
})

// Stack
const Stack = task(t => direction => props => {
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
        alignItems: t.getMatch(alignX)({
          top: 'start',
          center: 'center',
          bottom: 'end',
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
        justifyContent: t.getMatch(alignY)({
          left: 'start',
          center: 'center',
          right: 'end',
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

export const VStack = Stack('vertical')
export const HStack = Stack('horizontal')

// Grid
export const Row = task(t => props =>
  React.createElement(
    HStack,
    t.merge(t.omit(['box'], props), {
      box: t.merge({ flexWrap: true }, t.pathOr({}, ['box'], props)),
    })
  )
)

const colWidth = task(t => width =>
  t.isNil(width) ? width : t.gte(width, 12) ? 'full' : `${width}/12`
)
export const Col = task(t => props =>
  React.createElement(
    VStack,
    t.merge(t.omit(['box'], props), {
      box: t.merge(
        {
          flex: 'none',
          width: [
            colWidth(t.pathOr(null, ['xs'], props)),
            {
              sm: colWidth(t.pathOr(null, ['sm'], props)),
              md: colWidth(t.pathOr(null, ['md'], props)),
              lg: colWidth(t.pathOr(null, ['lg'], props)),
              xl: colWidth(t.pathOr(null, ['xl'], props)),
            },
          ],
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
)

// Spacer
export const Spacer = task(t => props =>
  React.createElement(
    Box,
    t.merge(t.omit(['box'], props), {
      box: t.merge({ flex: 1 }, t.pathOr({}, ['box'], props)),
    })
  )
)

// Icon
export const Icon = task(t => props => {
  const as = t.pathOr('i', ['as'], props)
  const prefix = t.pathOr('eva', ['prefix'], props)
  const icon = t.pathOr('', ['name'], props)
  const fontSize = t.pathOr(null, ['size'], props)
  const color = t.pathOr(null, ['color'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(
      t.omit(
        ['as', 'prefix', 'className', 'name', 'size', 'color', 'box'],
        props
      ),
      {
        as,
        className: `${prefix} ${prefix}-${icon}${
          t.isNil(className) ? '' : ` ${className}`
        }`,
        box: t.merge(
          {
            fontSize,
            color,
          },
          t.pathOr({}, ['box'], props)
        ),
      }
    )
  )
})

// Text
export const Text = task(t => props => {
  const as = t.pathOr('span', ['as'], props)
  const fontSize = t.pathOr(null, ['size'], props)
  const fontFamily = t.pathOr(null, ['family'], props)
  const fontWeight = t.pathOr(null, ['weight'], props)
  const color = t.pathOr(null, ['color'], props)
  const fontSmoothing = t.pathOr(null, ['smoothing'], props)
  const letterSpacing = t.pathOr(null, ['letterSpacing'], props)
  const lineHeight = t.pathOr(null, ['lineHeight'], props)
  const textAlignX = t.pathOr(null, ['x'], props)
  const textAlignY = t.pathOr(null, ['y'], props)
  const textDecoration = t.pathOr(null, ['decoration'], props)
  const textTransform = t.pathOr(null, ['transform'], props)
  const whitespace = t.pathOr(null, ['space'], props)
  const wordBreak = t.pathOr(null, ['break'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(
      t.omit(
        [
          'as',
          'className',
          'box',
          'size',
          'family',
          'weight',
          'color',
          'smoothing',
          'letterSpacing',
          'lineHeight',
          'x',
          'y',
          'decoration',
          'transform',
          'space',
          'break',
        ],
        props
      ),
      {
        as,
        className,
        box: t.merge(
          {
            fontSize,
            fontFamily,
            fontWeight,
            color,
            fontSmoothing,
            letterSpacing,
            lineHeight,
            textAlignX,
            textAlignY,
            textDecoration,
            textTransform,
            whitespace,
            wordBreak,
          },
          t.pathOr({}, ['box'], props)
        ),
      }
    )
  )
})

// Spinner
export const Spinner = task(t => props => {
  const size = t.pathOr(null, ['size'], props)
  const color = t.pathOr(null, ['color'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['className', 'size', 'color', 'box'], props), {
      className: `spinner ${t.isNil(size) ? '' : ` spinner-${size}`} ${
        t.isNil(className) ? '' : ` ${className}`
      }`,
      box: t.merge(
        {
          color,
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

// Button
export const Button = task(t => props => {
  const as = t.pathOr('button', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  const size = t.pathOr('md', ['size'], props)
  const color = t.pathOr(null, ['color'], props)
  const bgColor = t.pathOr(null, ['bg'], props)
  const borderColor = t.pathOr(null, ['border'], props)
  const borderRadius = t.pathOr(null, ['radius'], props)
  const borderWidth = t.pathOr(null, ['borderWidth'], props)
  const fontWeight = t.pathOr(null, ['weight'], props)
  const fontFamily = t.pathOr(null, ['family'], props)
  const proportion = t.getMatch(size)({
    sm: {
      padding: { x: 3, y: 2 },
      fontSize: 'sm',
      fontWeight: fontWeight || 'normal',
    },
    md: {
      padding: { x: 4, y: 2 },
      fontSize: 'base',
      fontWeight: fontWeight || 'bold',
    },
    lg: {
      padding: { x: 6, y: 3 },
      fontSize: 'lg',
      fontWeight: fontWeight || 'bold',
    },
  })
  return React.createElement(
    Box,
    t.merge(
      t.omit(
        [
          'as',
          'className',
          'box',
          'size',
          'color',
          'bg',
          'border',
          'radius',
          'weight',
          'family',
        ],
        props
      ),
      {
        as,
        className,
        box: t.mergeAll([
          {
            color,
            bgColor,
            borderColor,
            borderRadius,
            fontFamily,
            borderWidth: t.and(t.isNil(borderColor), t.isNil(borderWidth))
              ? null
              : t.isNil(borderWidth)
              ? true
              : borderWidth,
          },
          proportion,
          t.pathOr({}, ['box'], props),
        ]),
      }
    )
  )
})

// Input
export const Input = task(t => props => {
  const as = t.pathOr('input', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'box'], props), {
      as,
      className: `form-input${t.isNil(className) ? '' : ` ${className}`}`,
      box: t.merge(
        {
          display: 'block',
          width: 'full',
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

// Textarea
export const TextArea = task(t => props => {
  const as = t.pathOr('textarea', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'box'], props), {
      as,
      className: `form-textarea${t.isNil(className) ? '' : ` ${className}`}`,
      box: t.merge(
        {
          display: 'block',
          width: 'full',
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

// Select
export const Select = task(t => props => {
  const as = t.pathOr('select', ['as'], props)
  const multiple = t.pathOr(null, ['multiple'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'box'], props), {
      as,
      className: `${t.isNil(multiple) ? 'form-select' : 'form-multiselect'}${
        t.isNil(className) ? '' : ` ${className}`
      }`,
      box: t.merge(
        {
          display: 'block',
          width: 'full',
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

// Checkbox
export const Checkbox = task(t => props => {
  const as = t.pathOr('input', ['as'], props)
  const type = t.pathOr('checkbox', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'type'], props), {
      as,
      type,
      className: `form-checkbox${t.isNil(className) ? '' : ` ${className}`}`,
    })
  )
})

// Radio
export const Radio = task(t => props => {
  const as = t.pathOr('input', ['as'], props)
  const type = t.pathOr('radio', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'type'], props), {
      as,
      type,
      className: `form-radio${t.isNil(className) ? '' : ` ${className}`}`,
    })
  )
})

// meta
export const Match = task(t => props => {
  const cases = t.pathOr({}, ['when'], props)
  const handleCases = t.pathOr({}, ['renderWhen'], props)
  const value = t.pathOr(null, ['value'], props)
  const nextProps = t.omit(['value', 'when', 'renderWhen'], props)
  const matched = t.has(value)(cases)
    ? { render: cases[value], type: 'value' }
    : t.has(value)(handleCases)
    ? { render: handleCases[value], type: 'handler' }
    : null
  const nextElseCase = t.isNil(matched)
    ? t.has('_')(cases)
      ? { render: cases['_'], type: 'value' }
      : t.has('_')(handleCases)
      ? { render: handleCases['_'], type: 'handler' }
      : null
    : null
  const nextMatched = t.and(t.isNil(matched), t.isNil(nextElseCase))
    ? null
    : t.isNil(matched)
    ? nextElseCase
    : matched
  return t.isNil(nextMatched)
    ? null
    : t.eq(nextMatched.type, 'value')
    ? nextMatched.render
    : React.createElement(nextMatched.render, nextProps)
})
