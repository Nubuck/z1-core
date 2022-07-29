import { fn } from '@z1/lib-state-box'

// main
const createFeature = fn(t => (rawName, factory, initial = {}) => (props = {}) => {
  const name = t.to.camelCase(rawName)
  const ui = t.at('ui', props)
  return t.merge(
    { name },
    factory(
      t.mergeAll([
        { name },
        t.mergeDeepRight(initial, t.omit(['ui'], props)),
        { ui },
      ]) || {}
    )
  )
})

const combineFeatures = fn(t => (featureList = []) =>
  t.reduce(
    (combined, feature) => {
      return {
        state: t.notType(t.at('state', feature), 'Array')
          ? combined.state
          : t.concat(combined.state, t.at('state', feature)),
        ui: t.notType(t.at('ui', feature), 'Object')
          ? combined.ui
          : t.merge(combined.ui, {
              [feature.name]: t.at('ui', feature),
            }),
        routing: t.notType(t.at('routing', feature), 'Array')
          ? combined.routing
          : t.concat(combined.routing, t.at('routing', feature)),
        parts: t.notType(t.at('parts', feature), 'Object')
          ? combined.parts
          : t.merge(combined.parts, {
              [feature.name]: t.at('parts', feature),
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
