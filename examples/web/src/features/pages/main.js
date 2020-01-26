import z from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { landingRoute, notFoundRoute } from './ui'

// main
export const feature = z.create(
  'pages',
  ctx => {
    return {
      state: [state],
      routing: [
        {
          action: [z.routing.actions.notFound],
          ui: notFoundRoute(ctx.ui),
        },
        {
          action: [state.actions.routeLanding],
          ui: landingRoute(ctx.ui),
        },
      ],
    }
  },
  { ui: null }
)
