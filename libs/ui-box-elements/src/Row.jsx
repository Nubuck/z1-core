import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { HStack } from './Stack'

// main
export const Row = task(t => props =>
    React.createElement(
      HStack,
      t.merge(t.omit(['box'], props), {
        box: t.merge({ flexWrap: true }, t.pathOr({}, ['box'], props)),
      })
    )
  )