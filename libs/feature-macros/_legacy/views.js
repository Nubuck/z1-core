import React from 'react'
import { task } from '@z1/lib-feature-box'

// ui
export const createView = task(t => (key, { state, ui }) => {
  // TODO: allow a view to render on detail or more keys
  key = key || 'NOT_FOUND'
  return { key: t.caseTo.constantCase(key), state, ui }
})

export const combineViews = task(t => (viewList = []) => {
  const nextResult = t.reduce(
    (result, view) => {
      return t.merge(result, {
        state: t.merge(result.state, {
          [view.key]: view.state || {},
        }),
        ui: t.merge(result.ui, {
          [view.key]: view.ui || null,
        }),
      })
    },
    { state: {}, ui: {} },
    viewList
  )
  return {
    state: nextResult.state,
    ui: props =>
      t.mapObjIndexed(V => (t.isNil(V) ? V : V(props)), nextResult.ui),
  }
})

export const renderView = task(
  t => (Views = null, state = {}, mutations = {}) => {
    if (t.isNil(Views)) {
      return null
    }
    const data = t.pathOr({}, ['views', state.viewKey], state)
    const View = Views[state.viewKey]
    return t.isNil(View)
      ? t.has('NOT_FOUND')(Views)
        ? React.createElement(Views.NOT_FOUND, { state: data, mutations })
        : null
      : React.createElement(View, { state: data, mutations })
  }
)

export const routeActions = task(t => (actions = {}) =>
  t.filter(
    action => t.globrex('*/ROUTE_*').regex.test(action),
    t.map(([_, value]) => value, t.toPairs(actions))
  )
)