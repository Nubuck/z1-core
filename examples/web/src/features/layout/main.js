import z from '@z1/lib-feature-box'

// parts
import { state, registerNav } from './state'

// main
export const feature = z.create(
  'layout',
  parts => {
    return {
      state,
      parts:{
        registerNav
      }
    }
  },
  { ui: null }
)
