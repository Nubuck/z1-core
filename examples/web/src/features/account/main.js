import z from '@z1/lib-feature-box'

// parts
import stateKit from './state'
import views from './views'

// main
export const feature = z.create(
  'account',
  parts => {
    const state = stateKit(parts)
    return {
      state: [state],
      routing: [
        {
          action: z.routing.parts.routeActions(state),
          ui: parts.ui.viewRoute({
            views,
            query: { account: 'state' },
            ui: parts.ui,
            mutators: state.mutators,
          }),
        },
      ],
    }
  },
  { ui: null }
)
