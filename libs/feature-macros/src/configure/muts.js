import { fn } from '@z1/lib-feature-box'

// ctx
import { types } from '../types'

// main
export const viewActionParam = fn(t => (actions, action) => {
  return t.match({
    [actions.routeHome]: 'view',
    [actions.routeView]: 'view',
    [actions.routeViewDetail]: 'detail',
    [actions.routeViewMore]: 'more',
  })(action.type)
})

export const routingFromAction = fn(t => action => {
  const params = {
    view: t.pathOr('home', ['payload', 'view'], action),
    detail: t.pathOr(null, ['payload', 'detail'], action),
    more: t.pathOr(null, ['payload', 'more'], action),
  }
  return t.mergeAll([
    {
      route: {
        path: t.pathOr(
          null,
          ['meta', 'location', 'current', 'pathname'],
          action
        ),
        action: t.pathOr(null, ['meta', 'location', 'current', 'type'], action),
        key: t.tags.oneLineTrim`
          ${t.tags.oneLineInlineLists`
            ${t.mapIndexed(
              ([_, value], index) =>
                `${t.isNil(value) ? '' : t.to.camelCase(value)}${
                  t.or(t.isNil(value), t.eq(2, index)) ? '' : '_'
                }`,
              t.to.pairs(params)
            )}`}`,
      },
    },
    { params },
  ])
})

export const findViewKey = fn(t => (actions, action, viewKeys) => {
  const routing = routingFromAction(action)
  const viewByKey = t.find(
    viewKey => t.eq(viewKey.key, routing.route.key),
    viewKeys
  )
  if (t.not(t.isNil(viewByKey))) {
    return viewByKey
  } else {
    const paramType = viewActionParam(actions, action)
    const view = t.find(
      viewKey =>
        t.and(
          t.eq(viewKey.name, routing.params[paramType]),
          t.eq(viewKey.param, paramType)
        ),
      viewKeys
    )
    if (t.not(t.isNil(view))) {
      return view
    } else {
      return null
    }
  }
})
