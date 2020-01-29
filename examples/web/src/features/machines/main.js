import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// parts
import stateKit from './state'
import views from './views'

// main
export const feature = z.create(
  'machines',
  parts => {
    const state = stateKit(parts)
    return {
      state: [state],
      routing: [
        {
          action: z.routing.parts.routeActions(state),
          ui: mx.view.route({
            views,
            query: { machines: 'state' },
            ui: parts.ui,
            mutators: state.mutators,
          }),
        },
      ],
    }
  },
  { ui: null }
)
