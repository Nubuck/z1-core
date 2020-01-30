import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// parts
import stateKit from './state'
import views from './views'

// main
export const feature = z.create(
  'machines',
  parts => {
    const state = stateKit(parts.state)
    return {
      state: [state],
      routing: [
        {
          actions: mx.view.routeActions(state),
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
