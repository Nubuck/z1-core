import { fn as Fn } from '@z1/lib-state-box'

// parts
import { box } from './box'
import { state } from './state'
import { store } from './store'
import { route } from './route'
import { ui } from ''

// main
export const featureBox = Fn(t =>
  t.merge(box, {
    state,
    store: store({ combine: state.combine }),
    ui,
    route,
  })
)
export const fn = Fn
export const task = Fn
