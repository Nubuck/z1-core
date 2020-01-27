import React from 'react'
import z from '@z1/lib-feature-box'

// main
export const screen = z.fn(t => ctx => {
  return z.ui.connect(
    ['nav', 'location', 'account'],
    ctx.mutators
  )(props => {
    return <div />
  })
})
