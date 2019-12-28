import { fn } from '@z1/lib-feature-box'

// main
export const combine = fn(t => (views = []) => {
  return {
    state() {
      return {}
    },
    ui() {
      return {}
    },
  }
})
