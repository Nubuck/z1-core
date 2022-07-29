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
const routeActionRegex = fn(t => t.globrex('*/ROUTING/*').regex)
export const routing = fn(t => ({
  render(actionType, routing = []) {
    const matchedDef = t.find(routeDef => {
      const actionKey = t.has('action')(routeDef) ? 'action' : 'actions'
      const renderAction = t.at(actionKey, routeDef)
      if (t.isNil(renderAction)) {
        return false
      }
      return t.gt(
        t.findIndex(
          action => t.eq(actionType, action),
          t.isType(renderAction, 'Array') ? renderAction : [renderAction]
        ),
        -1
      )
    }, routing)
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
      return t.filter(
        action => routeActionRegex.test(action),
        t.values(t.atOr({}, 'actions', box))
      )
    },
  },
}))
