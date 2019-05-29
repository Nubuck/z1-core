import { task } from '@z1/preset-task'
// import { Sequelize } from '@z1/preset-feathers-server'

// parts
import { commonHooks } from './common'

// INTERFACE:
// models(createModel, SequelizeTypes, SequelizeLiteral)
// services(createService, models, hooks: { data, auth, common })
// channels(app)
// lifecycle: {
//    beforeConfig(app) {},
//    authConfig(app) {},
//    afterConfig(app) {},
//    onSetup(app) {},
//    onStart(app) {},
// }
export const makeCreateApiBox = task(
  t => (makeModels, createService) => ({
    models,
    services,
    channels,
    lifecycle,
  }) => {
    return {
      models: t.notType(models, 'Function') ? undefined : makeModels(models),
      services: t.notType(services, 'Function')
        ? undefined
        : (app, models) =>
            t.map(service => service(app))(
              services(createService, models, commonHooks) || []
            ),
      channels: t.notType(channels, 'Function')
        ? undefined
        : app => {
            channels(app)
          },
      lifecycle: t.notType(lifecycle, 'Object')
        ? undefined
        : (key, app) => {
            if (t.isType(t.path([key], lifecycle), 'Function')) {
              t.path([key], lifecycle)(app)
            }
          },
    }
  }
)

const mergeLifecycle = task(t => (collection, source) => {
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

export const makeComposeApiBox = task(t => createApiBox => (props, parts) => {
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
  }, combinedParts.lifecycle || [])

  return createApiBox(
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

// INTERFACE:
// boxes: array of api boxes from createApiBox({...}) or composeApiBox({...},[...])
export const makeCombineApiBoxes = task(
  t => ({ beforeSetup, onSetup, getModels }) => boxes => {
    const nextBoxes = t.reduce(
      (collection, box) => {
        return {
          models: t.notType(box.models, 'Function')
            ? collection.models
            : t.concat(collection.models, [box.models]),
          services: t.notType(box.services, 'Function')
            ? collection.services
            : t.concat(collection.services, [box.services]),
          channels: t.notType(box.channels, 'Function')
            ? collection.channels
            : t.concat(collection.channels, [box.channels]),
          lifecycle: t.notType(box.lifecycle, 'Function')
            ? collection.lifecycle
            : t.concat(collection.lifecycle, [box.lifecycle]),
        }
      },
      {
        models: [],
        services: [],
        channels: [],
        lifecycle: [],
      },
      boxes
    )
    return {
      collection: nextBoxes,
      lifecycle: key => app => {
        t.forEach(action => {
          if (t.isType(action, 'Function')) {
            action(key, app)
          }
        }, nextBoxes.lifecycle || [])
      },
      configure: app => {
        beforeSetup(app, nextBoxes)

        // associate models on setup
        const oldSetup = app.setup
        app.setup = function(...args) {
          const result = oldSetup.apply(this, args)

          onSetup(app, nextBoxes)

          // lifecycle onSetup
          t.forEach(action => {
            action('onSetup', app)
          }, nextBoxes.lifecycle || [])

          return result
        }

        const nextModels = getModels(app)
        // register services
        t.forEach(service => {
          if (t.isType(service, 'Function')) {
            service(app, nextModels)
          }
        }, nextBoxes.services || [])
      },
    }
  }
)
