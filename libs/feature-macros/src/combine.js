import { fn } from '@z1/lib-feature-box'

// main
export const combine = fn(t => (rawViews = []) => {
  const views = t.sort(t.ascend(t.prop('key')), rawViews)
  const viewKeys = t.map(view => t.pick(['name', 'key', 'param'], view), views)
  const params = t.mapObjIndexed(
    groupKeys => t.map(groupKey => groupKey.key, groupKeys),
    t.groupBy(view => view.param, viewKeys)
  )
  return {
    viewKeys,
    params,
    state(ctx = {}) {
      return t.mergeAll([
        { viewKeys, params },
        {
          views: t.mergeAll(
            t.map(view => {
              return {
                [view.key]: view.state(
                  t.merge(ctx, { params, viewKeys, key: view.key })
                ),
              }
            }, views)
          ),
        },
      ])
    },
    ui(ctx = {}) {
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
