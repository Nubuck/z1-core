import { task } from '@z1/preset-task'

// main
export const combine = task(t => ctx => {
  return (boxes = []) => {
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
      configure(app) {
        const adapterStore = app.get('adapterStore')
        const adapterKeys = t.keys(adapterStore)

        // register models
        t.forEach(modelsFactory => {
          if (t.isType(modelsFactory, 'Function')) {
            modelsFactory(app)
          }
        }, nextBoxes.models)

        // register services
        t.forEach(servicesFactory => {
          if (t.isType(servicesFactory, 'Function')) {
            servicesFactory(app)
          }
        }, nextBoxes.services || [])

        // adapter beforeSetup
        t.forEach(adapterName => {
          const beforeSetup = t.pathOr(
            () => {},
            [adapterName, 'beforeSetup'],
            adapterStore
          )
          beforeSetup(nextBoxes)
        }, adapterKeys)

        // associate models on setup
        const oldSetup = app.setup
        app.setup = function(...args) {
          const result = oldSetup.apply(this, args)

          // adapter onSetup
          t.forEach(adapterName => {
            const onSetup = t.pathOr(
              () => {},
              [adapterName, 'onSetup'],
              adapterStore
            )
            onSetup(nextBoxes)
          }, adapterKeys)

          // lifecycle onSetup
          t.forEach(action => {
            action('onSetup', app)
          }, nextBoxes.lifecycle || [])

          return result
        }

        // adapter afterSetup
        t.forEach(adapterName => {
          const afterSetup = t.pathOr(
            () => {},
            [adapterName, 'afterSetup'],
            adapterStore
          )
          afterSetup(nextBoxes)
        }, adapterKeys)
      },
    }
  }
})
