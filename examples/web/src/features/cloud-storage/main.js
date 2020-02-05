import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// parts
import stateKit from './state'
import views from './views'

// main
const name = 'cloudStorage'
export const feature = z.create(
  name,
  parts => {
    const state = stateKit(parts.state)
    return {
      state: [state],
      routing: [
        {
          actions: mx.view.routeActions(state),
          ui: mx.view.route({
            views,
            query: [name],
            box: name,
            ui: parts.ui,
            mutators: state.mutators,
          }),
        },
      ],
    }
  },
  { ui: null }
)
