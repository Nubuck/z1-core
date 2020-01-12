import zbx from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { route } from './route'

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
          action: zbx.routing.actions(state),
          ui: route({ ui: ctx.ui, mutators: state.mutators }),
        },
      ],
    }
  },
  { ui: null }
)
