// bump 47
import { task } from '@z1/preset-task'
import { combineReducers, applyMiddleware, createStore } from 'redux'
import { createLogic, createLogicMiddleware } from 'redux-logic'
import { composeReducers, makeActionCreator } from 'redux-toolbelt'

// rx
import { fromEvent, of } from 'rxjs'
import {
  filter,
  tap,
  map,
  switchMap,
  merge,
  takeUntil,
  catchError,
} from 'rxjs/operators'

const makeMutationCreator = task(
  t => (name, initialState) => (actionOrActions, reducer) => {
    const createAction = makeActionCreator.withDefaults({
      prefix: `${name}/`,
    })
    const transforms = t.reduce(
      (mutations, item) => {
        return {
          actions: t.merge(mutations.actions, {
            [`${item.action}`]: item.mutation.TYPE,
          }),
          mutations: t.merge(mutations.mutations, {
            [`${item.action}`]: item.mutation,
          }),
          reducers: t.merge(mutations.reducers, {
            [item.mutation.TYPE]: reducer,
          }),
        }
      },
      {
        actions: {},
        mutations: {},
        reducers: {},
      },
      t.map(type => {
        return {
          action: t.caseTo.camelCase(type),
          mutation: createAction(t.caseTo.constantCase(type)),
        }
      })(
        t.eq('Array', t.type(actionOrActions))
          ? actionOrActions
          : [actionOrActions]
      ) || []
    )
    return {
      mutations: transforms.mutations,
      actions: transforms.actions,
      reducer: (state = initialState, action) => {
        return t.not(transforms.reducers[action.type])
          ? state
          : transforms.reducers[action.type](state, action)
      },
    }
  }
)

const createEffect = task(
  t => type => (actionOrActions, processOrGuard, options = {}) => {
    const fx = t.eq('fx', type)
      ? { process: processOrGuard }
      : { validate: processOrGuard }
    return createLogic(t.mergeAll([{ type: actionOrActions }, options, fx]))
  }
)

export const createStateBox = task(
  t => ({ name, initial, mutations, guards, effects, onInit }) => {
    const nextHandles = t.reduce(
      (handles, mutation) => {
        return {
          actions: t.merge(handles.actions, mutation.actions),
          mutations: t.merge(handles.mutations, mutation.mutations),
          reducers: t.concat(handles.reducers, [mutation.reducer]),
        }
      },
      {
        actions: {},
        mutations: {},
        reducers: [],
      },
      t.not(mutations)
        ? []
        : mutations(makeMutationCreator(name || 'box', initial || {}))
    )
    const effectContext = {
      actions: nextHandles.actions,
      mutations: nextHandles.mutations,
    }
    const nextGuards = t.not(guards)
      ? []
      : guards(createEffect('guards'), effectContext)
    const fx = t.not(effects) ? [] : effects(createEffect('fx'), effectContext)
    return {
      name,
      actions: nextHandles.actions,
      mutations: nextHandles.mutations,
      reducer: composeReducers(...nextHandles.reducers),
      effects: t.concat(nextGuards || [], fx || []),
      onInit: t.not(onInit)
        ? undefined
        : ctx => {
            onInit(
              t.merge(ctx, {
                actions: nextHandles.actions,
                mutations: nextHandles.mutations,
              })
            )
          },
    }
  }
)
const passThrough = function() {
  return {}
}
export const combineStateBoxes = task(t => (boxes, reducer = undefined) => {
  const reduceBy = t.and(t.not(t.isNil(reducer)), t.isType(reducer, 'Function'))
    ? reducer
    : passThrough
  return t.reduce(
    (nextBoxes, box) => {
      return t.merge(
        {
          reducers: t.merge(nextBoxes.reducers, { [box.name]: box.reducer }),
          effects: t.concat(nextBoxes.effects, box.effects),
          onInit: t.not(box.onInit)
            ? nextBoxes.onInit
            : t.concat(nextBoxes.onInit, [box.onInit]),
        },
        reduceBy(nextBoxes, box)
      )
    },
    {
      reducers: {},
      effects: [],
      onInit: [],
    },
    boxes
  )
})

export const createStateStore = task(
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
    disableLogging,
  }) => {
    const nextBoxes = t.isType(boxes, 'Object')
      ? boxes
      : combineStateBoxes(boxes)
    const effects = createLogicMiddleware(nextBoxes.effects, context || {})
    const nextMiddleware = t.flatten([
      beforeware || [],
      middleware || [],
      effects,
      afterware || [],
    ])
    if (t.and(logger, t.eq(process.env.NODE_ENV, 'development'))) {
      if (t.not(disableLogging)) {
        nextMiddleware.push(logger)
      }
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
    return store
  }
)

export const reloadStateStore = task(t => (store, boxes) => {
  const nextBoxes = t.isType(boxes, 'Object') ? boxes : combineStateBoxes(boxes)
  store.replaceReducer(
    combineReducers(t.merge(nextBoxes.reducers, store._reducers))
  )
  store._effects.replaceLogic(nextBoxes.effects)
  return null
})

export const Task = task((t, a) => factory =>
  factory(
    t.merge(t, {
      anyOf(list = []) {
        return t.gt(t.findIndex(subject => t.eq(subject, true), list), -1)
      },
      allOf(list = []) {
        return t.eq(
          t.length(t.filter(subject => t.eq(subject, false), list)),
          0
        )
      },
    }),
    a,
    {
      of,
      fromEvent,
      filter,
      tap,
      map,
      switchMap,
      merge,
      takeUntil,
      catchError,
    }
  )
)
