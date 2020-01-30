import { fn } from '@z1/lib-feature-box'
import { types } from './types'
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
      const nextViews = t.mergeAll(
        t.map(view => {
          return {
            [view.key]: view.state(
              t.mergeAll([ctx, types, { params, viewKeys, key: view.key }])
            ),
          }
        }, views)
      )
      return {
        _shouldSub: t.anyOf(
          t.map(([_, viewMacro]) => viewMacro._shouldSub, t.to.pairs(nextViews))
        ),
        viewKeys,
        params,
        views: nextViews,
      }
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
