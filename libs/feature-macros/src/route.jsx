import React from 'react'
import z from '@z1/lib-feature-box'

// parts
import { render } from './render'

// main
export const route = z.fn(t => ctx => {
  const query = z.ui.query(ctx.query, true)
  const stateKey = t.atOr('state', 'box', ctx)
  const nextState = props => t.pick(query.keys.to, props)
  function Route(props) {
    return render(
      ctx.views.ui(ctx.ui),
      nextState(props),
      props.mutations,
      stateKey,
      props.dispatch
    )
  }
  Route.displayName = 'Route'
  return z.ui.connect(query.selector, ctx.mutators, Route)
})
