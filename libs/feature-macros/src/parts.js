import z from '@z1/lib-feature-box'

// main
const viewActions = [
  'ROUTE_HOME',
  'ROUTE_VIEW',
  'ROUTE_VIEW_DETAIL',
  'ROUTE_VIEW_MORE',
]
export const routeActions = z.fn(t => box => {
  const routeActions = z.routing.parts.routeActions(box)
  return t.filter(action => {
    return t.anyOf(t.map(view => t.includes(view, action), viewActions))
  }, routeActions)
})
