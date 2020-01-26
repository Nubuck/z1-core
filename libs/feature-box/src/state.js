import { stateBox, fn } from '@z1/lib-state-box'

// main
const createRouteFactory = fn(
  t => boxName => (path, actionType, reducer, props = {}) => {
    return t.mergeAll([
      {
        action: `${boxName}/ROUTING/${t.to.constantCase(actionType)}`,
        type: `ROUTING/${t.to.constantCase(actionType)}`,
      },
      { path, reducer },
      props,
    ])
  }
)

const createStateBox = fn(t => (name, props) => {
  const routesProp = t.pathOr(null, ['routes'], props)
  if (t.isNil(routesProp)) {
    const box = stateBox.create(name, props)
    return t.merge(box, {
      routes: {},
    })
  }
  const routes = routesProp(createRouteFactory(name), { name })
  const mutationsProp = t.pathOr(null, ['mutations'], props)
  const mutations = (m, b) => {
    const routeMuts = t.map(route => {
      return m(route.type, route.reducer)
    }, routes || [])
    const muts = t.isNil(mutationsProp) ? [] : mutationsProp(m, b)
    return t.concat(muts, routeMuts)
  }
  const box = stateBox.create(name, t.merge(props, { mutations }))
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

const composeStateBox = fn(t => (name, boxes = []) => {
  return stateBox.create(
    name,
    boxes,
    (nextParts, part) => {
      return {
        routes: t.not(t.has('routes')(part))
          ? nextParts.routes || []
          : t.concat(nextParts.routes || [], [part.routes]),
      }
    },
    (nextParts = {}) => (props = {}) => {
      return createStateBox(
        name,
        t.merge(props, {
          routes(r, b) {
            return t.flatten(
              t.map(route => route(r, b))(nextParts.routes || [])
            )
          },
        })
      )
    }
  )
})

const createOrCompose = fn(t => (rawName, boxOrBoxes) => {
  const name = t.to.camelCase(rawName)
  if (t.isType(boxOrBoxes, 'array')) {
    return composeStateBox(name, boxOrBoxes)
  }
  return createStateBox(name, boxOrBoxes)
})

const combineStateBoxes = fn(t => boxes => {
  return stateBox.combine(boxes, (nextBoxes, box) => {
    return {
      routes: t.merge(nextBoxes.routes || {}, box.routes || {}),
    }
  })
})

export const state = {
  create: createOrCompose,
  combine: combineStateBoxes,
}
