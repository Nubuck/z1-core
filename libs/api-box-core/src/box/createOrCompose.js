import { task } from '@z1/preset-task'

// main
const create = task(t => ctx => {
  return ({ models, services, channels, lifecycle }) => {
    return {
      models: t.notType(models, 'Function')
        ? undefined
        : createModel => models(createModel),
      services: t.notType(services, 'Function')
        ? undefined
        : createService => services(createService, ctx.commonHooks),
      channels: t.notType(channels, 'Function')
        ? undefined
        : app => channels(app),
      lifecycle: t.notType(lifecycle, 'Object')
        ? undefined
        : (key, app) => t.atOr(() => {}, key, lifecycle || {})(app),
    }
  }
})

const mergeLifecycle = task(t => (collection, part) => {
  const partKeys = t.keys(part)
  if (t.isZeroLen(partKeys)) {
    return collection
  }
  return t.reduce(
    (col, key) => {
      return t.merge(col, {
        [key]: t.has(key)(col)
          ? t.concat(col[key] || [], [part[key]])
          : [part[key]],
      })
    },
    collection,
    partKeys
  )
})

const compose = task(t => ctx => {
  return (props, parts) => {
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

    return ctx.create(
      t.merge(props, {
        models(m) {
          return t.flatten(
            t.map(
              modelsFactory => modelsFactory && modelsFactory(m),
              combinedParts.models
            )
          )
        },
        services(s, h) {
          return t.flatten(
            t.map(
              servicesFactory => servicesFactory && servicesFactory(s, h),
              combinedParts.services
            )
          )
        },
        channels(a) {
          return t.flatten(
            t.map(
              channelFactory => channelFactory && channelFactory(a),
              combinedParts.channels
            )
          )
        },
        lifecycle: t.isZeroLen(t.keys(combinedParts.lifecycle))
          ? undefined
          : t.fromPairs(
              t.map(([key, actionList]) => {
                return [
                  key,
                  app => {
                    t.forEach(action => {
                      if (t.isType(action, 'Function')) {
                        action(app)
                      }
                    }, actionList || [])
                  },
                ]
              }, t.to.pairs(combinedParts.lifecycle))
            ),
      })
    )
  }
})

export const createOrCompose = task(t => ctx => {
  const Create = create(ctx)
  const Compose = compose(t.merge(ctx, { create: Create }))
  return (rawName, boxOrBoxes) => {
    const name = t.to.camelCase(rawName)
    if (t.isType(boxOrBoxes, 'array')) {
      return Compose({ name }, boxOrBoxes)
    }
    return Create(t.merge({ name }, boxOrBoxes))
  }
})
