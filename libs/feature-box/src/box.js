import { fn } from '@z1/lib-state-box'

// main
const createFeature = fn(t => (factory, initial = {}) => (props = {}) => {
  const ui = t.path(['ui'], props)
  return factory(
    t.merge(t.mergeDeepRight(initial, t.omit(['ui'], props)), { ui })
  )
})

const combineFeatures = fn(t => (featureList = []) =>
  t.reduce(
    (combined, feature) => {
      return {
        state: t.notType(t.path(['state'], feature), 'Array')
          ? combined.state
          : t.concat(combined.state, t.path(['state'], feature)),
        ui: t.notType(t.path(['ui'], feature), 'Object')
          ? combined.ui
          : t.merge(combined.ui, {
              [feature.name]: t.path(['ui'], feature),
            }),
        routing: t.notType(t.path(['routing'], feature), 'Array')
          ? combined.routing
          : t.concat(combined.routing, t.path(['routing'], feature)),
        parts: t.notType(t.path(['parts'], feature), 'Object')
          ? combined.parts
          : t.merge(combined.parts, {
              [feature.name]: t.path(['parts'], feature),
            }),
      }
    },
    {
      state: [],
      ui: {},
      routing: [],
      parts: {},
    },
    featureList
  )
)

export const box = {
  create: createFeature,
  combine: combineFeatures,
}
