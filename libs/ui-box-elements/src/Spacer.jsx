import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
export const Spacer = task(t => props =>
    React.createElement(
      Box,
      t.merge(t.omit(['box'], props), {
        box: t.merge({ flex: 1 }, t.pathOr({}, ['box'], props)),
      })
    )
  )