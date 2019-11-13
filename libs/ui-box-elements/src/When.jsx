import React from 'react'
import { task } from '@z1/preset-task'

// main
export const When = task(t => props => {
  const is = t.pathOr(false, ['is'], props)
  return t.not(is)
    ? null
    : React.createElement(React.Fragment, t.omit(['is'], props))
})
