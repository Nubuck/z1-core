import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
export const Icon = task(t => props => {
  const as = t.pathOr('i', ['as'], props)
  const prefix = t.pathOr('fa', ['prefix'], props)
  const iconPrefix = t.pathOr('fa', ['iconPrefix'], props)
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
        className: `${prefix} ${iconPrefix}-${icon}${
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
