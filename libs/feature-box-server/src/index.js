import * as ApiBox from '@z1/lib-api-box-sql'
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

const mergeLifecycle = Task(t => (collection, source) => {
  const srcKeys = t.keys(source)
  const existingKeys = t.filter(
    colKey => t.gt(t.findIndex(srcKey => t.eq(colKey, srcKey), srcKeys), -1),
    t.keys(collection)
  )
  const nextKeys = t.filter(
    srcKey => t.lt(t.findIndex(exKey => t.eq(srcKey, exKey), existingKeys), 0),
    srcKeys
  )
  return t.mergeAll([
    t.mapObjIndexed((val, key) => {
      return t.gt(t.findIndex(exKey => t.eq(key, exKey), existingKeys), -1)
        ? t.concat(val || [], [source[key]])
        : val
    }, collection),
    t.fromPairs(t.map(nxKey => [nxKey, [source[nxKey]]], nextKeys)),
  ])
})

export const composeApiBox = Task(t => (props, parts) => {
  const combinedParts = t.reduce(
    (collection, part) => {
      return {
        models: t.not(t.has('models')(part))
          ? collection.models
          : t.concat(collection.models, [part.models]),
        services: t.not(t.has('services')(part))
          ? collection.services
          : t.concat(collection.services, [part.services]),
        channels: t.not(t.has('channels')(part))
          ? collection.channels
          : t.concat(collection.channels, [part.channels]),
        lifecycle: t.not(t.has('lifecycle')(part))
          ? collection.lifecycle
          : mergeLifecycle(collection.lifecycle, part.lifecycle),
      }
    },
    {
      models: [],
      services: [],
      channels: [],
      lifecycle: {},
    },
    parts || []
  )

  const lifecycle = t.mapObjIndexed(val => {
    return a => {
      t.forEach(action => {
        if (t.isType(action, 'Function')) {
          action(a)
        }
      }, val || [])
    }
  }, combinedParts.lifecycle)

  return ApiBox.createApiBox(
    t.merge(props, {
      models(m, T) {
        return t.flatten(t.map(model => model(m, T), combinedParts.models))
      },
      services(s, m, h) {
        return t.flatten(
          t.map(service => service(s, m, h), combinedParts.services)
        )
      },
      channels(a) {
        return t.flatten(t.map(channel => channel(a), combinedParts.channels))
      },
      lifecycle,
    })
  )
})

export const createKit = Task(t => (initial, factory) => (props = {}) => {
  return factory(t.mergeDeepRight(initial, props))
})

export const createFeature = Task(
  t => (factory, initial = {}) => (props = {}) => {
    return factory(t.mergeDeepRight(initial, props))
  }
)

export const task = Task
export const createApiBox = ApiBox.createApiBox
export const combineApiBoxes = ApiBox.combineApiBoxes
export const createApi = ApiBox.createApi
export const createApiServer = ApiBox.createApiServer
export const runServer = ApiBox.runServer
export const reloadServer = ApiBox.reloadServer
export const createAppServer = ApiBox.createAppServer
export const reloadAppServer = ApiBox.reloadAppServer
export const FeathersErrors = ApiBox.FeathersErrors
export const appMiddleware = ApiBox.appMiddleware
export const fs = ApiBox.fs
