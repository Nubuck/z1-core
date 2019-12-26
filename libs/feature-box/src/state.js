import { stateBox, fn } from '@z1/lib-state-box'

// main
const createRoute = fn(t => boxName => (actionType, pathOrProps, reducer) => {
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
  const routes = props.routes(createRoute(props.name))
  const mutations = m => {
    const muts = props.mutations(m)
    const routeMuts = t.map(route => {
      return m(route.type, route.reducer)
    }, routes)
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
    routeActions: t.keys(nextRoutes),
  })
})
const composeStateBox = fn(t => (props, parts) => {
  
})
const combineStateBoxes = fn(t => boxes => {})

export const state = {
  create: createStateBox,
  compose: composeStateBox,
  combine: combineStateBoxes,
}
