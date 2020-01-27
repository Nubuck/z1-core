import z from '@z1/lib-feature-box'

// parts
import { state, registerNav } from './state'
import { routeNotFound, screen } from './ui'

// main
export const feature = z.create(
  'layout',
  parts => {
    const RouteNotFound = routeNotFound(parts.ui)
    const Screen = screen({ ui: parts.ui, mutators: state.mutators })
    return {
      state,
      ui: {
        RouteNotFound,
        Screen,
      },
      parts: {
        registerNav,
      },
    }
  },
  { ui: null }
)
