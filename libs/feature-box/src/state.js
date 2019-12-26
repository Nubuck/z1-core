import { stateBox, fn } from '@z1/lib-state-box'

// main
const createRouteFactory = fn(t => boxName => (actionType, pathOrProps, reducer) => {
  return t.mergeAll([
    {
      action: `${boxName}/${t.caseTo.constantCase(actionType)}`,
      type: t.caseTo.camelCase(actionType),
    },
    t.isType(pathOrProps, 'String') ? { path: pathOrProps } : pathOrProps,
    { reducer },
  ])
})

const createStateBox = fn(t => props => {
  const routesProp = t.pathOr(null,['routes'], props)
  if (t.isNil(routesProp)){
    return stateBox.create(props)
  }
  const routes = routesProp(createRouteFactory(props.name))
  const mutationsProp = t.pathOr(null,['mutations'], props)
  const mutations = m => {
    const routeMuts = t.map(route => {
      return m(route.type, route.reducer)
    }, routes || [])
    const muts = t.isNil(mutationsProp) ? [] : mutationsProp(m)
    return t.concat(muts, routeMuts)
  }
  const box = stateBox.create(t.merge(props, { mutations }))
  const nextRoutes = t.mergeAll(
    t.map(
      route => ({
        [route.action]: t.omit(['action', 'type', 'reducer'], route),
      }),
      routes
    )
  )
  return t.merge(box, {
    routes: nextRoutes,
  })
})
const composeStateBox = fn(t => (props, parts) => {
  const nextParts = t.reduce(
    (collection, part) => {
      return {
        initial: t.not(t.has('initial')(part))
          ? collection.initial
          : t.mergeDeepRight(collection.initial, part.initial || {}),
        mutations: t.not(t.has('mutations')(part))
          ? collection.mutations
          : t.concat(collection.mutations, [part.mutations]),
        routes: t.not(t.has('routes')(part))
          ? collection.routes
          : t.concat(collection.routes, [part.routes]),
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
      routes: [],
      guards: [],
      effects: [],
      onInit: [],
    },
    parts || []
  )
  return createStateBox(
    t.mergeAll([
      {
        initial: t.mergeDeepRight(nextParts.initial || {}, props.initial || {}),
      },
      t.omit(['initial'], props || {}),
      {
        mutations(m) {
          return t.flatten(
            t.map(mutation => mutation(m))(nextParts.mutations || [])
          )
        },
        routes(r) {
          return t.flatten(
            t.map(route => route(r))(nextParts.routes || [])
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
})
const combineStateBoxes = fn(t => boxes => {
  return stateBox.combine(boxes, (nextBoxes, box) => {
    return {
      routes: t.merge(nextBoxes.routes || {}, box.routes),
    }
  })
})

export const state = {
  create: createStateBox,
  compose: composeStateBox,
  combine: combineStateBoxes,
}
