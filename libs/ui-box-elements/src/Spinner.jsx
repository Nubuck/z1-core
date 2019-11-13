import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
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
  