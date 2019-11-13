import React from 'react'
import { task } from '@z1/preset-task'

// main
export const MapIndexed = task(t => props => {
  const render = t.pathOr(null, ['render'], props)
  if (t.notType(render, 'Function')) {
    return null
  }
  const list = t.pathOr([], ['list'], props)
  return React.createElement(
    React.Fragment,
    {},
    t.mapIndexed((item, index) => render(item, index), list)
  )
})
