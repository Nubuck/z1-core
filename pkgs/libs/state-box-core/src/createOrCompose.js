import { fn } from './fn'
import { composeReducers } from 'redux-toolbelt'

// parts
import { createMutationFactory, createEffectFactory } from './parts'

// main
const create = fn(
  t => ({ name, initial, mutations, guards, effects, onInit, afterInit }) => {
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
        : mutations(createMutationFactory(name || 'box', initial || {}), {
            name,
          })
    )
    const effectContext = {
      name,
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
                name,
                actions: nextHandles.actions,
                mutators: nextHandles.mutators,
                // for back compat
                mutations: nextHandles.mutators,
              })
            )
          },
      afterInit: t.not(afterInit)
        ? undefined
        : ctx => {
            afterInit(
              t.merge(ctx, {
                name,
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

const compose = fn(t => (props, parts, composeWith, createWith) => {
  const nextParts = t.reduce(
    (collection, part) => {
      return t.merge(
        {
          initial: t.not(t.has('initial')(part))
            ? collection.initial
            : t.mergeDeepRight(collection.initial, part.initial || {}),
          mutations: t.not(t.has('mutations')(part))
            ? collection.mutations
            : t.concat(collection.mutations, [part.mutations]),
          guards: t.not(t.has('guards')(part))
            ? collection.guards
            : t.concat(collection.guards, [part.guards]),
          effects: t.not(t.has('effects')(part))
            ? collection.effects
            : t.concat(collection.effects, [part.effects]),
          onInit: t.not(t.has('onInit')(part))
            ? collection.onInit
            : t.concat(collection.onInit, [part.onInit]),
          afterInit: t.not(t.has('afterInit')(part))
            ? collection.afterInit
            : t.concat(collection.afterInit, [part.afterInit]),
        },
        composeWith(collection, part)
      )
    },
    {
      initial: {},
      mutations: [],
      guards: [],
      effects: [],
      onInit: [],
      afterInit: [],
    },
    parts || []
  )
  return createWith(nextParts)(
    t.mergeAll([
      {
        initial: t.mergeDeepRight(nextParts.initial || {}, props.initial || {}),
      },
      t.omit(['initial'], props || {}),
      {
        mutations(m, box) {
          return t.flatten(
            t.map(mutation => mutation(m, box))(nextParts.mutations || [])
          )
        },
        guards(g, box) {
          return t.flatten(
            t.map(guard => guard(g, box))(nextParts.guards || [])
          )
        },
        effects(fx, box) {
          return t.flatten(
            t.map(effect => effect(fx, box))(nextParts.effects || [])
          )
        },
        onInit(ctx) {
          t.forEach(onInit => onInit(ctx), nextParts.onInit || [])
        },
        afterInit(ctx) {
          t.forEach(afterInit => afterInit(ctx), nextParts.afterInit || [])
        },
      },
    ])
  )
})

export const createOrCompose = fn(
  t => (
    rawName,
    boxOrBoxes,
    composeWith = () => ({}),
    createWith = () => props => create(props)
  ) => {
    const name = t.to.camelCase(rawName)
    if (t.isType(boxOrBoxes, 'array')) {
      return compose({ name }, boxOrBoxes, composeWith, createWith)
    }
    return create(t.merge({ name }, boxOrBoxes))
  }
)
