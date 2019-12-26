import { fn } from './fn'
import { createLogic } from 'redux-logic'
import { makeActionCreator } from 'redux-toolbelt'

// main
export const createMutationFactory = fn(
  t => (name, initialState) => (actionOrActions, reducer) => {
    const createAction = makeActionCreator.withDefaults({
      prefix: `${name}/`,
    })
    const transforms = t.reduce(
      (mutations, item) => {
        return {
          actions: t.merge(mutations.actions, {
            [`${item.action}`]: item.mutator.TYPE,
          }),
          mutators: t.merge(mutations.mutators, {
            [`${item.action}`]: item.mutator,
          }),
          reducers: t.merge(mutations.reducers, {
            [item.mutator.TYPE]: reducer,
          }),
        }
      },
      {
        actions: {},
        mutators: {},
        reducers: {},
      },
      t.map(type => {
        return {
          action: t.caseTo.camelCase(type),
          mutator: createAction(t.caseTo.constantCase(type)),
        }
      })(
        t.eq('Array', t.type(actionOrActions))
          ? actionOrActions
          : [actionOrActions]
      ) || []
    )
    return {
      mutations: transforms.mutators,
      mutators: transforms.mutators,
      actions: transforms.actions,
      reducer: (state = initialState, action) => {
        return t.not(transforms.reducers[action.type])
          ? state
          : transforms.reducers[action.type](state, action)
      },
    }
  }
)

export const createEffectFactory = fn(
  t => type => (actionOrActions, processOrGuard, options = {}) => {
    const fx = t.eq('fx', type)
      ? { process: processOrGuard }
      : { validate: processOrGuard }
    return createLogic(t.mergeAll([{ type: actionOrActions }, options, fx]))
  }
)
