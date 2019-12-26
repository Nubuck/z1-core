import { fn } from './fn'
import { composeReducers } from 'redux-toolbelt'

// parts
import { createMutationFactory, createEffectFactory } from './parts'

// main
export const create = fn(
  t => ({ name, initial, mutations, guards, effects, onInit }) => {
    const nextHandles = t.reduce(
      (handles, mutation) => {
        return {
          actions: t.merge(handles.actions, mutation.actions),
          mutators: t.merge(handles.mutators, mutation.mutators),
          reducers: t.concat(handles.reducers, [mutation.reducer]),
        }
      },
      {
        actions: {},
        mutators: {},
        reducers: [],
      },
      t.not(mutations)
        ? []
        : mutations(createMutationFactory(name || 'box', initial || {}))
    )
    const effectContext = {
      actions: nextHandles.actions,
      mutators: nextHandles.mutators,
      // for back compat
      mutations: nextHandles.mutators,
    }
    const nextGuards = t.not(guards)
      ? []
      : guards(createEffectFactory('guards'), effectContext)
    const fx = t.not(effects)
      ? []
      : effects(createEffectFactory('fx'), effectContext)
    return {
      name,
      actions: nextHandles.actions,
      mutators: nextHandles.mutators,
      // for back compat
      mutations: nextHandles.mutators,
      reducer: composeReducers(...nextHandles.reducers),
      effects: t.concat(nextGuards || [], fx || []),
      onInit: t.not(onInit)
        ? undefined
        : ctx => {
            onInit(
              t.merge(ctx, {
                actions: nextHandles.actions,
                mutators: nextHandles.mutators,
                // for back compat
                mutations: nextHandles.mutators,
              })
            )
          },
    }
  }
)
