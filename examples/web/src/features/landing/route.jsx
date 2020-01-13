import React from 'react'
import zbx from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

//parts
import views from './views'

// main
export const route = ctx => {
  const Views = views.ui(ctx.ui)
  return zbx.ui.connect(
    zbx.ui.query(['landing']),
    ctx.mutators
  )(({ landing, mutations }) => (
    <div>{mx.routeView.render(Views, landing, mutations)}</div>
  ))
}

export const LandingRoute = () => (
  <div>
    <h1>Home</h1>
    <zbx.ui.Link to="/pages">pages</zbx.ui.Link>
  </div>
)

export const NotFoundRoute = () => (
  <div>
    <h1>404 Not Found</h1>
    <zbx.ui.Link to="/">Home</zbx.ui.Link>
  </div>
)
