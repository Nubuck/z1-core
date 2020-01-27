import z from '@z1/lib-feature-box'

// parts
import { state, registerNav } from './state'
import { routeNotFound, screen } from './ui'

// main
export const feature = z.create(
  'layout',
  parts => {
    return {
      state,
      ui: {
        Screen: screen({ ui: parts.ui, mutators: state.mutators }),
      },
      parts: {
        registerNav,
      },
      routing: [
        {
          action: [z.routing.actions.notFound],
          ui: routeNotFound(parts.ui),
        },]
    }
  },
  { ui: null }
)
