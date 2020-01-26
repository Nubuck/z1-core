import z from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { route } from './route'

// main
export const feature = z.create(
  'account',
  parts => {
    return {
      state: [state],
      routing: [
        {
          action: z.routing.parts.routeActions(state),
          ui: route({ ui: parts.ui, mutators: state.mutators }),
        },
      ],
    }
  },
  { ui: null }
)
