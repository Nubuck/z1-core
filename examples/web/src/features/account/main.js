import z from '@z1/lib-feature-box'

// parts
import { state } from './state'

// main
export const feature = z.create(
  'account',
  ctx => {
    return {
      state: [state],
      // ui: {},
      // parts: {},
      // routing: [
      //   {
      //     action: [],
      //     ui: null,
      //   },
      // ],
    }
  },
  { ui: null }
)
