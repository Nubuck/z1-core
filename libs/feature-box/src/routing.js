import React from 'react'
import { fn } from '@z1/lib-state-box'
import {
  NOT_FOUND,
  ADD_ROUTES,
  actionToPath,
  pathToAction,
  isLocationAction,
  addRoutes,
} from 'redux-first-router'

// main
export const routing = fn(t => ({
  render(actionType, routing = []) {
    const matchedDef = t.find(
      routeDef =>
        t.gt(
          t.findIndex(
            action => t.eq(actionType, action),
            t.isType(routeDef.action, 'Array')
              ? routeDef.action
              : [routeDef.action]
          ),
          -1
        ),
      routing
    )
    if (t.isNil(matchedDef.ui)) {
      return null
    }
    return React.createElement(matchedDef.ui, { key: actionType })
  },
  actions: {
    notFound: NOT_FOUND,
    addRoutes: ADD_ROUTES,
  },
  mutators: {
    addRoutes,
  },
  parts: {
    actionToPath,
    pathToAction,
    isLocationAction,
    routeActions(box) {
      return t.keys(t.pathOr({}, ['routes'], box))
    },
  },
}))
