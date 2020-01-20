import z from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { route } from './route'

// main
export const feature = z.create(
  'account',
  ctx => {
    return {
      state: [state],
      // ui: {},
      // parts: {},
      routing: [
        {
          action: z.routing.parts.routeActions(state),
          ui: route({ ui: ctx.ui, mutators: state.mutators }),
        },
      ],
    }
  },
  { ui: null }
)
