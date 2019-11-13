import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
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
