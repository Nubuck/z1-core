import { stateBox, fn } from '@z1/lib-state-box'
import { compose } from 'redux'
import { connectRoutes, redirect } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'

// main
const createStateStore = fn(t => ({ combine }) => props => {})
const reloadStateStore = ({ combine }) => (store, boxes) =>
  stateBox.store.reload(store, combine(boxes))

export const store = {
  create: createStateStore,
  reload: reloadStateStore,
}
