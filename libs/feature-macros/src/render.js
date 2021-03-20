import React from 'react'
import { fn } from '@z1/lib-feature-box'

// main
export const render = fn(
  (t) => (
    Views = null,
    stateProp = {},
    mutations = {},
    stateKey = null,
    dispatch = null
  ) => {
    if (t.isNil(Views)) {
      return null
    }
    const noKey = t.isNil(stateKey)
    const state = noKey ? stateProp : t.atOr({}, stateKey, stateProp)
    const data = t.pathOr({}, ['views', t.at('active.view', state)], state)
    const baseProps = { state: data, mutations, dispatch }
    const viewProps = noKey
      ? baseProps
      : t.merge(baseProps, t.omit([stateKey], stateProp))
    const View = Views[state.active.view]
    return t.isNil(View)
      ? t.has('notFound')(Views)
        ? React.createElement(Views.notFound, viewProps)
        : null
      : React.createElement(View, viewProps)
  }
)
