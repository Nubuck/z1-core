import z from '@z1/lib-feature-box'

// parts
import { state } from './state'
import { landingRoute } from './ui'

// main
export const feature = z.create(
  'pages',
  parts => {
    return {
      state: [state],
      routing: [

        {
          action: [state.actions.routeLanding],
          ui: landingRoute(parts.ui),
        },
      ],
    }
  },
  { ui: null }
)
