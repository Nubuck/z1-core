import z from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { route, LandingRoute, NotFoundRoute } from './route'

// main
export const feature = z.create(
  'pages',
  ctx => {
    return {
      state: [state],
      ui: {},
      parts: {},
      routing: [
        {
          action: [z.routing.actions.notFound],
          ui: NotFoundRoute,
        },
        {
          action: [state.actions.routeLanding],
          ui: LandingRoute,
        },
        {
          action: [
            state.actions.routeHome,
            state.actions.routeView,
            state.actions.routeViewDetail,
            state.actions.routeViewMore,
          ],
          ui: route({ ui: ctx.ui, mutators: state.mutators }),
        },
      ],
    }
  },
  { ui: null }
)
