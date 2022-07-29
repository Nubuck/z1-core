import { fn } from './fn'
import { combineReducers, applyMiddleware, createStore } from 'redux'
import { createLogicMiddleware } from 'redux-logic'

// parts
import { combine } from './combine'

// main
const create = fn(
  t => ({
    boxes,
    context,
    reducers,
    beforeware,
    middleware,
    afterware,
    enhance,
    initial,
    logger,
    logging,
  }) => {
    const nextBoxes = t.isType(boxes, 'Object') ? boxes : combine(boxes)
    const effects = createLogicMiddleware(nextBoxes.effects, context || {})
    const nextMiddleware = t.flatten([
      beforeware || [],
      middleware || [],
      effects,
      afterware || [],
    ])
    if (t.and(logger, t.eq(logging, true))) {
      nextMiddleware.push(logger)
    }
    const appliedMiddleware = applyMiddleware(...nextMiddleware)
    const storeArgs = t.isType(enhance, 'Function')
      ? enhance(appliedMiddleware)
      : initial
      ? [initial, appliedMiddleware]
      : [appliedMiddleware]
    const store = createStore(
      combineReducers(t.merge(nextBoxes.reducers, reducers || {})),
      ...storeArgs
    )
    store._effects = effects
    store._reducers = reducers || {}
    const ctx = t.merge(context || {}, {
      getState: store.getState,
      dispatch: store.dispatch,
      subscribe: store.subscribe,
    })
    t.forEach(onInit => {
      if (t.isType(onInit, 'Function')) {
        onInit(ctx)
      }
    }, nextBoxes.onInit)
    t.forEach(afterInit => {
      if (t.isType(afterInit, 'Function')) {
        afterInit(ctx)
      }
    }, nextBoxes.afterInit)
    return store
  }
)

const reload = fn(t => (store, boxes) => {
  const nextBoxes = t.isType(boxes, 'Object') ? boxes : combine(boxes)
  store.replaceReducer(
    combineReducers(t.merge(nextBoxes.reducers, store._reducers))
  )
  store._effects.replaceLogic(nextBoxes.effects)
  return null
})

export const store = {
  create,
  reload,
}
