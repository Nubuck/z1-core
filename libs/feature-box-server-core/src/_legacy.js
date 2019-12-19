import { task as Task } from '@z1/preset-task'

export const combineFeatures = Task(t => featureList =>
  t.reduce(
    (combinedFeatures, feature) => {
      return {
        api: t.notType(t.path(['api'], feature), 'Array')
          ? combinedFeatures.api
          : t.concat(combinedFeatures.api, t.path(['api'], feature)),
        hooks: t.notType(t.path(['hooks'], feature), 'Object')
          ? combinedFeatures.hooks
          : t.merge(combineFeatures.hooks, {
              [feature.name || 'common']: t.path(['hooks'], feature),
            }),
        tasks: t.notType(t.path(['tasks'], feature), 'Object')
          ? combinedFeatures.tasks
          : t.merge(combineFeatures.tasks, {
              [feature.name || 'common']: t.path(['tasks'], feature),
            }),
      }
    },
    {
      api: [],
      hooks: {},
      tasks: {},
    },
    featureList
  )
)

export const createKit = Task(t => (initial, factory) => (props = {}) => {
  return factory(t.mergeDeepRight(initial, props))
})

export const createFeature = Task(
  t => (factory, initial = {}) => (props = {}) => {
    return factory(t.mergeDeepRight(initial, props))
  }
)

export const task = Task
