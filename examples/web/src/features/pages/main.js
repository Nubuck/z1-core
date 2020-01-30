import z from '@z1/lib-feature-box'

// parts
import stateKit from './state'
import { routeLanding } from './routeLanding'

// main
export const feature = z.create(
  'pages',
  parts => {
    const state = stateKit(parts.state)
    return {
      state: [state],
      routing: [
        {
          action: state.actions.routeLanding,
          ui: routeLanding(parts.ui),
        },
      ],
    }
  },
  { ui: null }
)
