import { stateBoxCore, fn as Fn } from '@z1/lib-state-box-core'
import createNodeLogger from 'redux-node-logger'

export const stateBox = Fn(t =>
  t.merge(stateBoxCore, {
    compose(props, parts) {
      const nextParts = t.reduce(
        (collection, part) => {
          return {
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
          }
        },
        {
          initial: {},
          mutations: [],
          guards: [],
          effects: [],
          onInit: [],
        },
        parts || []
      )
      return stateBoxCore.create(
        t.mergeAll([
          {
            initial: t.mergeDeepRight(
              nextParts.initial || {},
              props.initial || {}
            ),
          },
          t.omit(['initial'], props || {}),
          {
            mutations(m) {
              return t.flatten(
                t.map(mutation => mutation(m))(nextParts.mutations || [])
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
          },
        ])
      )
    },
    store: t.merge(stateBoxCore.store, {
      create(props) {
        return stateBoxCore.store.create(
          t.merge(props, { logger: createNodeLogger() })
        )
      },
    }),
  })
)
export const fn = Fn
export const task = Fn
