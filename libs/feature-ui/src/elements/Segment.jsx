import React from 'react'
import z from '@z1/lib-feature-box'
import { HStack, Button, MapIndexed } from '@z1/lib-ui-box-elements'

// parts
const shapes = z.fn((t) =>
  t.match({
    _: false,
    normal: 'lg',
    square: false,
    pill: 'full',
    circle: 'full',
  })
)

// main
export const renderSegment = z.fn((t) => (props) => {
  const onChange = t.atOr(() => {}, 'onChange', props)
  const buttons = t.atOr({}, 'buttons', props)
  const buttonCount = t.len(t.keys(buttons))
  const selected = t.at('selected', props)
  const multi = t.at('multi', props)
  const disabled = t.at('disabled', props)
  // appearance
  const size = t.atOr('sm', 'size', props)
  const fill = t.atOr('outline', 'fill', props)
  const shape = t.atOr('normal', 'shape', props)
  const borderWidth = t.atOr(2, 'borderWidth', props)
  const radius = t.atOr(shapes(shape), 'borderRadius', props)
  const colors = t.atOr(
    multi
      ? {
          on: {
            bg: 'blue-500',
            border: 'blue-400',
            content: 'white',
          },
          off: 'blue-500',
        }
      : {
          on: {
            bg: 'yellow-500',
            border: 'yellow-500',
            content: 'gray-900',
          },
          off: 'yellow-500',
        },
    'colors',
    props
  )
  const buttonProps = {
    as: 'div',
    size,
    fill,
    shape,
    colors,
    alignSelf: 'stretch',
    disabled,
  }
  // box
  const nextProps = t.omit(
    [
      'onChange',
      'buttons',
      'selected',
      'fill',
      'shape',
      'borderWidth',
      'multi',
    ],
    props
  )
  return (
    <HStack x="center" y="center" {...nextProps}>
      <MapIndexed
        items={t.to.pairs(buttons)}
        render={([key, button], index) => {
          const btn = t.isNil(button) ? {} : button
          const preProps = t.and(t.eq(0, index), t.eq(1, buttonCount))
            ? // single button
              t.merge(buttonProps, { borderWidth })
            : t.eq(0, index)
            ? // first button
              t.merge(buttonProps, {
                borderWidth,
                borderRadius: { left: radius, right: false },
              })
            : t.eq(index, buttonCount - 1)
            ? // last button
              t.merge(buttonProps, {
                borderWidth: {
                  top: borderWidth,
                  bottom: borderWidth,
                  right: borderWidth,
                },
                borderRadius: { right: radius, left: false },
              })
            : // inbetween
              t.merge(buttonProps, {
                borderWidth: {
                  top: borderWidth,
                  bottom: borderWidth,
                  right: borderWidth,
                },
                borderRadius: false,
              })
          const segSelected = multi
            ? t.includes(key, selected || [])
            : t.eq(key, selected)
          const hasLink = t.and(t.notNil(btn.as), t.notNil(btn.to))
          const segProps = t.mergeAll([
            preProps,
            {
              selected: segSelected,
              next: (b) => b.next({ padding: { x: 1 } }),
            },
            hasLink
              ? {}
              : multi
              ? {
                  onClick: (e) => {
                    e.preventDefault()
                    onChange(
                      segSelected
                        ? t.filter((v) => t.neq(v, key), selected)
                        : t.append(key, selected)
                    )
                  },
                }
              : segSelected
              ? { cursor: 'default' }
              : {
                  onClick: (e) => {
                    e.preventDefault()
                    onChange(key)
                  },
                },
                btn,
            t.and(multi, segSelected) ? { icon: 'check-circle' } : {},
            t.eq('xs', size)
              ? { label: { text: btn.label, margin: 0 } }
              : {},
          ])
          return <Button key={`segment_${key}`} {...segProps} />
        }}
      />
    </HStack>
  )
})
export class Segment extends React.Component {
  render() {
    return renderSegment(this.props)
  }
}
Segment.displayName = 'Segment'
