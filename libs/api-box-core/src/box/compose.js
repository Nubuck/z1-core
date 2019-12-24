import { task } from '@z1/preset-task'

// main
export const compose = task(t => ctx => {
  const hasKey = (matchKey, keyList) =>
    t.gt(
      t.findIndex(key => t.eq(matchKey, key), keyList),
      -1
    )
  const mergeLifecycle = (collection, source) => {
    const srcKeys = t.keys(source)
    const existingKeys = t.filter(
      colKey => hasKey(colKey, srcKeys),
      t.keys(collection)
    )
    const nextKeys = t.filter(srcKey => hasKey(srcKey, existingKeys), srcKeys)
    return t.mergeAll([
      t.mapObjIndexed(
        (val, key) =>
          hasKey(key, existingKeys) ? t.concat(val || [], [source[key]]) : val,
        collection
      ),
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
        lifecycle,
      })
    )
  }
})
