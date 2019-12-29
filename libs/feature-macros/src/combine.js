import { fn } from '@z1/lib-feature-box'

// main
export const combine = fn(t => (views = []) => {
  return {
    state(ctx) {
      return t.mergeAll(
        t.map(view => {
          return {
            [view.key]: view.state(ctx),
          }
        }, views)
      )
    },
    ui(ctx) {
      return t.mergeAll(
        t.map(view => {
          return {
            [view.key]: view.ui(ctx),
          }
        }, views)
      )
    },
  }
})
