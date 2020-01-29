import React from 'react'
import z from '@z1/lib-feature-box'

// parts
import { render } from './render'

// main
export const route = ctx => {
  function Route(props) {
    return render(ctx.views.ui(ctx.ui), props.state, props.mutations)
  }
  Route.displayName = 'Route'
  return z.ui.connect(ctx.query, ctx.mutators, Route)
}
