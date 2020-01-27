import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const viewRoute = ctx => {
  function Route(props) {
    return mx.routeView.render(ctx.views.ui(ctx.ui), props.state, props.mutations)
  }
  Route.displayName = 'Route'
  return z.ui.connect(ctx.query, ctx.mutators, Route)
}
