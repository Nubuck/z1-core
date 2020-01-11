import { fn } from '@z1/lib-feature-box'

// main
export const combine = fn(t => (rawViews = []) => {
  const views = t.sort(t.ascend(t.prop('key')), rawViews)
  return {
    views: t.map(view => view.key, views),
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
