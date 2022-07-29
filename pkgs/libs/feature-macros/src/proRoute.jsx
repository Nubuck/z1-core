import React from 'react'
import z from '@z1/lib-feature-box'

// parts
import { route } from './route'

// main
export const proRoute = z.fn((t) => (ctx) => {
  const stateKey = t.atOr('state', 'box', ctx)
  const views = ctx.views.ui({ ...ctx.ui, mutators: ctx.mutators })
  const ViewRoute = route({
    views: ctx.views,
    query: [stateKey],
    box: stateKey,
    ui: ctx.ui,
    mutators: ctx.mutators,
  })
  const matchConnectedRoute = t.globrex(ctx.match).regex
  function MetaRoute(props) {
    if (t.not(matchConnectedRoute.test(props.routePath))) {
      return React.createElement(ViewRoute)
    }
    const ActiveView = t.atOr(null, props.view, views)
    return React.createElement(ActiveView)
  }
  MetaRoute.displayName = 'MetaRoute'
  const ConnectedMeta = z.ui.connect(
    (state) => {
      return {
        routePath: t.atOr('', 'location.pathname', state),
        view: t.path([stateKey, 'active', 'view'], state),
      }
    },
    ctx.mutators,
    MetaRoute
  )
  return ConnectedMeta
})
export default proRoute
