import z from '@z1/lib-feature-box'

// parts
import { state } from './state'

// main
export const feature = z.create(
  'layout',
  parts => {
    return {
      state,
    }
  },
  { ui: null }
)
