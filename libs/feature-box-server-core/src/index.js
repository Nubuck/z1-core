import { task as Fn } from '@z1/preset-task'

// main
export const featureBox = Fn(f => ({
  create(rawName, factory, initial = {}) {
    const name = t.to.camelCase(rawName)
    return (props = {}) =>
      t.merge(
        { name },
        factory(f.mergeDeepRight(initial, t.merge({ name }, props) || {}))
      )
  },
  combine(features = []) {
    return f.reduce(
      (combined, feature) => {
        return {
          api: f.notType(f.path(['api'], feature), 'Array')
            ? combined.api
            : f.concat(combined.api, f.path(['api'], feature)),
          hooks: f.notType(f.path(['hooks'], feature), 'Object')
            ? combined.hooks
            : f.merge(combined.hooks, {
                [feature.name || 'common']: f.path(['hooks'], feature),
              }),
          parts: f.notType(f.path(['parts'], feature), 'Object')
            ? combined.parts
            : f.merge(combined.parts, {
                [feature.name || 'common']: f.path(['parts'], feature),
              }),
        }
      },
      {
        api: [],
        hooks: {},
        parts: {},
      },
      features
    )
  },
  fn: Fn,
}))

export const task = Fn
export const fn = Fn
export default featureBox
