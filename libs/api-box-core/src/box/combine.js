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
      configure: app => {
        // beforeSetup(app, nextBoxes)
        // const dbTasks = app.get('dbTasks')
        const dbCtx = app.get('dbCtx')
        t.forEach(key => {
          const adapter = dbCtx[key]
          if (t.isType(adapter.beforeSetup, 'Function')) {
            adapter.beforeSetup(nextBoxes)
          }
        }, t.keys(dbCtx) || [])

        // associate models on setup
        const oldSetup = app.setup
        app.setup = function(...args) {
          const result = oldSetup.apply(this, args)

          // onSetup(app, nextBoxes)
          t.forEach(key => {
            const adapter = dbCtx[key]
            if (t.isType(adapter.onSetup, 'Function')) {
              adapter.onSetup(nextBoxes)
            }
          }, t.keys(dbCtx) || [])

          // lifecycle onSetup
          t.forEach(action => {
            action('onSetup', app)
          }, nextBoxes.lifecycle || [])

          return result
        }

        // const nextModels = getModels(app)
        // register services
        // t.forEach(service => {
        //   if (t.isType(service, 'Function')) {
        //     // service(app, nextModels)
        //   }
        // }, nextBoxes.services || [])
        t.forEach(key => {
          const adapter = dbCtx[key]
          if (t.isType(adapter.afterSetup, 'Function')) {
            adapter.afterSetup(nextBoxes)
          }
        }, t.keys(dbCtx) || [])
      },
    }
  }
})
