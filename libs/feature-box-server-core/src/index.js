import { task as fn } from '@z1/preset-task'

// main
export const featureBox = fn(f => ({
  create(factory, initial = {}) {
    return (props = {}) => factory(f.mergeDeepRight(initial, props))
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
          tasks: f.notType(f.path(['tasks'], feature), 'Object')
            ? combined.tasks
            : f.merge(combined.tasks, {
                [feature.name || 'common']: f.path(['tasks'], feature),
              }),
        }
      },
      {
        api: [],
        hooks: {},
        tasks: {},
      },
      features
    )
  },
}))

export const task = fn
