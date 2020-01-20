import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

//parts
import views from './views'

// main
export const route = ctx => {
  const Views = views.ui(ctx.ui)
  return z.ui.connect(
    z.ui.query([{ account: 'state' }]),
    ctx.mutators
  )(props => mx.routeView.render(Views, props.state, props.mutations))
}
