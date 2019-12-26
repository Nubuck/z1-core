import { stateBox, fn } from '@z1/lib-state-box'
import { compose } from 'redux'
import { connectRoutes, redirect } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'

// main
const createStateStore = fn(t => ({ combine }) => props => {
  const combinedBoxes = combine(props.boxes)
  const router = connectRoutes(
    combinedBoxes.routes,
    t.merge(
      { restoreScroll: restoreScroll() },
      t.not(t.has('routerOptions')(props)) ? {} : props.routerOptions
    )
  )
  return core.createStateStore(
    t.merge(t.omit(['routerOptions'], props), {
      context: t.merge(props.context, { redirect }),
      boxes: combinedBoxes,
      middleware: t.concat(props.middleware || [], [router.middleware]),
      reducers: t.merge(props.reducers || {}, {
        location: router.reducer,
      }),
      enhance(appliedMiddleware) {
        return [compose(router.enhancer, appliedMiddleware)]
      },
    })
  )
})
const reloadStateStore = ({ combine }) => (store, boxes) =>
  stateBox.store.reload(store, combine(boxes))

export const store = ctx => ({
  create: createStateStore(ctx),
  reload: reloadStateStore(ctx),
})
