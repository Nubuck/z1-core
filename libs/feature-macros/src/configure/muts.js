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

export const routeFromAction = fn(t => (boxName, action) => {
  const params = {
    view: t.pathOr('home', ['payload', 'view'], action),
    detail: t.pathOr(null, ['payload', 'detail'], action),
    more: t.pathOr(null, ['payload', 'more'], action),
  }
  return t.merge(
    {
      action: action.type.replace(`${boxName}/`, ''),
      key: t.tags.oneLineTrim`
      ${t.mapIndexed(
        ([_, value], index) =>
          `${t.isNil(value) ? '' : t.to.camelCase(key)}${
            t.or(t.isNil(value), t.eq(2, index)) ? '' : '_'
          }`,
        t.to.pairs(params)
      )}
      `,
    },
    params
  )
})

export const findViewKey = fn(t => (boxName, action, viewKeys) => {
  const route = routeFromAction(boxName, action)
  const viewByKey = t.find(viewKey => t.eq(viewKey.key, route.key), viewKeys)
  if (t.not(t.isNil(viewByKey))) {
    return viewByKey
  } else {
    const paramType = viewActionParam(actions, action)
    const view = t.find(
      viewKey =>
        t.and(
          t.eq(viewKey.name, route[paramType]),
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

const routeEnter = fn(t => (boxName, props) => (state, action) => {
  const route = routeFromAction(boxName, action)
  // const viewState = t.merge(t.pathOr({}, ['state'], props), { _: null })

  // const view = t.pathOr(null, ['payload', 'view'], action)
  // const matchedViewState = t.match(viewState)(t.to.camelCase(view))
  // if (t.isNil(matchedViewState)) {
  //   return state
  // }
  // const nextViewState = matchedViewState.data({
  //   event: types.event.routeEnter,
  //   status: null,
  //   error: null,
  //   viewData: {},
  //   nextData: {},
  // })
  // return t.isNil(nextState)
  //   ? state
  //   : t.merge(state, {
  //       views: t.merge(state.views, {
  //         [view]: { data: nextViewState },
  //       }),
  //     })
})

const routeExit = fn(t => (boxName, views) => (state, action) => {
  const route = routeFromAction(boxName, action)
})

const viewData = fn(t => (boxName, views) => (state, action) => {})

const formData = fn(t => (boxName, views) => (state, action) => {})

const modalData = fn(t => (boxName, views) => (state, action) => {})
