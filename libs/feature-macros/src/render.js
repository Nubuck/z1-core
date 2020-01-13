import React from 'react'
import { fn } from '@z1/lib-feature-box'

// main
export const render = fn(
  t => (Views = null, state = {}, mutations = {}) => {
    if (t.isNil(Views)) {
      return null
    }
    const data = t.pathOr({}, ['views', state.viewKey], state)
    const View = Views[state.viewKey]
    return t.isNil(View)
      ? t.has('notFound')(Views)
        ? React.createElement(Views.notFound, { state: data, mutations })
        : null
      : React.createElement(View, { state: data, mutations })
  }
)