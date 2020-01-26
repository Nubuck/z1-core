import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

//parts
import views from './views'

// main
export const route = ctx =>
  z.ui.connect({ account: 'state' }, ctx.mutators, function Route(props) {
    return mx.routeView.render(views.ui(ctx.ui), props.state, props.mutations)
  })
