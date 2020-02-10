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

export const routingFromAction = fn(
  t => (
    action,
    routePaths = {
      pathname: ['meta', 'location', 'current', 'pathname'],
      type: ['type'],
    }
  ) => {
    const params = {
      view: t.atOr('home', 'payload.view', action),
      detail: t.atOr(null, 'payload.detail', action),
      more: t.atOr(null, 'payload.more', action),
    }
    return t.mergeAll([
      {
        route: {
          path: t.pathOr(null, routePaths.pathname, action),
          action: t.pathOr(null, routePaths.type, action),
          key: t.replace(
            /\s/g,
            '',
            t.tags.oneLineInlineLists`
            ${t.mapIndexed(
              ([_, value], index) =>
                t.anyOf([t.isNil(value), t.eq(0, index)])
                  ? t.isNil(value)
                    ? ''
                    : t.to.camelCase(value)
                  : t.isNil(value)
                  ? ''
                  : `_${t.to.camelCase(value)}`,
              t.to.pairs(params)
            )}`
          ),
        },
      },
      { params },
    ])
  }
)

export const findViewKey = fn(t => (paramType, routing, viewKeys) => {
  const viewByKey = t.find(
    viewKey => t.eq(viewKey.key, routing.route.key),
    viewKeys
  )
  if (t.notNil(viewByKey)) {
    return viewByKey
  } else {
    const searchKeys = t.match({
      _: ['view'],
      more: ['view', 'detail'],
    })(paramType)
    const routingKey = t.replace(
      /\s/g,
      '',
      t.tags.oneLineInlineLists`${t.mapIndexed(
        (search, index) =>
          t.eq(0, index)
            ? t.to.camelCase(t.pathOr('', ['params', search], routing))
            : `_${t.to.camelCase(t.pathOr('', ['params', search], routing))}`,
        searchKeys
      )}`
    )
    const view = t.find(viewKey => t.eq(viewKey.key, routingKey), viewKeys)
    if (t.notNil(view)) {
      return view
    } else {
      return null
    }
  }
})

export const nextViewState = fn(t => (activeMacro, activeCtx) => {
  const nextData = activeMacro.data(activeCtx)
  const nextForm = activeMacro.form(
    t.isNil(nextData) ? activeCtx : t.merge(activeCtx, nextData)
  )
  const safeForm = t.isNil(nextForm)
    ? {}
    : { form: t.merge(activeCtx.form, nextForm) }
  const nextModal = activeMacro.modal(
    t.and(t.isNil(nextData), t.isNil(nextForm))
      ? activeCtx
      : t.mergeAll([activeCtx, t.isNil(nextData) ? {} : nextData, safeForm])
  )
  return t.omit(
    ['event', 'next', 'route', 'params'],
    t.mergeAll([
      activeCtx,
      t.isNil(nextData) ? {} : nextData,
      safeForm,
      t.isNil(nextModal) ? {} : { modal: t.merge(activeCtx.modal, nextModal) },
    ])
  )
})

export const onRouteEnter = fn(
  t => (viewMacros, paramType, viewKeys) => (state, action) => {
    const routing = routingFromAction(action)
    const viewKey = findViewKey(paramType, routing, viewKeys)
    const activeMacro = viewMacros[viewKey.key]
    const activeState = state.views[viewKey.key]
    const reEnter = t.eq(state.route.path, routing.route.path)
    const activeCtx = t.mergeAll([
      activeState,
      {
        event: types.event.routeEnter,
        status: t.and(reEnter, t.neq(activeState.status, types.status.init))
          ? types.status.ready
          : types.status.waiting,
        next: null,
        reEnter,
      },
      routing,
    ])
    const nextActiveState = nextViewState(activeMacro, activeCtx)
    return t.mergeAll([
      state,
      { status: 'active', active: { param: viewKey.param, view: viewKey.key } },
      routing,
      {
        views: t.merge(state.views, {
          [viewKey.key]: nextActiveState,
        }),
      },
    ])
  }
)
