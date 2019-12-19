import { task } from '@z1/preset-task'

// main
export const compose = task(t => ctx => {
  const mergeLifecycle = (collection, source) => {
    const srcKeys = t.keys(source)
    const existingKeys = t.filter(
      colKey =>
        t.gt(
          t.findIndex(srcKey => t.eq(colKey, srcKey), srcKeys),
          -1
        ),
      t.keys(collection)
    )
    const nextKeys = t.filter(
      srcKey =>
        t.lt(
          t.findIndex(exKey => t.eq(srcKey, exKey), existingKeys),
          0
        ),
      srcKeys
    )
    return t.mergeAll([
      t.mapObjIndexed((val, key) => {
        return t.gt(
          t.findIndex(exKey => t.eq(key, exKey), existingKeys),
          -1
        )
          ? t.concat(val || [], [source[key]])
          : val
      }, collection),
      t.fromPairs(t.map(nxKey => [nxKey, [source[nxKey]]], nextKeys)),
    ])
  }
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

    const lifecycle = t.mapObjIndexed(val => {
      return a => {
        t.forEach(action => {
          if (t.isType(action, 'Function')) {
            action(a)
          }
        }, val || [])
      }
    }, combinedParts.lifecycle || [])

    return ctx.create(
      t.merge(props, {
        models(m) {
          return t.flatten(t.map(model => model(m), combinedParts.models))
        },
        services(s, h) {
          return t.flatten(
            t.map(service => service(s, h), combinedParts.services)
          )
        },
        channels(a) {
          return t.flatten(t.map(channel => channel(a), combinedParts.channels))
        },
        lifecycle,
      })
    )
  }
})
