import { task as Fn } from '@z1/preset-task'
import { Fs } from '@z1/preset-tools'
// main
export const featureBox = Fn(t => ({
  create(rawName, factory, initial = {}) {
    const name = t.to.camelCase(rawName)
    return (props = {}) =>
      t.merge(
        { name },
        factory(t.mergeDeepRight(initial, t.merge({ name }, props) || {}))
      )
  },
  combine(features = []) {
    return t.reduce(
      (combined, feature) => {
        return {
          api: t.notType(t.at('api', feature), 'Array')
            ? combined.api
            : t.concat(combined.api, t.at('api', feature)),
          hooks: t.notType(t.at('hooks', feature), 'Object')
            ? combined.hooks
            : t.merge(combined.hooks, {
                [feature.name || 'common']: t.at('hooks', feature),
              }),
          parts: t.notType(t.at('parts', feature), 'Object')
            ? combined.parts
            : t.merge(combined.parts, {
                [feature.name || 'common']: t.at('parts', feature),
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
  fs: Fs,
}))

export const task = Fn
export const fn = Fn
export const fs = Fs
export default featureBox
