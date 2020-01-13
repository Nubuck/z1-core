import zbx from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { route, LandingRoute, NotFoundRoute } from './route'

// main
export const feature = zbx.create(
  'landing',
  ctx => {
    return {
      state: [state],
      ui: {},
      parts: {},
      routing: [
        {
          action: [zbx.routing.notFound],
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
