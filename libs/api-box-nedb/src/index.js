import { apiBoxCore, fn, fs } from '@z1/lib-api-box-core'
import { Nedb, FeathersNedb } from '@z1/preset-feathers-server-nedb'

// main
export const withNedbAdapter = fn(t => (ctx = {}) => {
  const adapters = t.pathOr([], ['adapters'], ctx)
  const adapter = app => {
    const dbTasks = app.get('dbTasks')
    return {
      name: 'nedb',
      beforeSetup(boxes) {
        const config = dbTasks.getConfig('nedb')
        fs.dir(config || 'nedb')
      },
      onSetup(boxes) {
        t.forEach(action => {
          action('onSync', app)
        }, boxes.lifecycle)
      },
      afterSetup(boxes) {},
      model(name, factory = {}) {
        const config = dbTasks.getConfig('nedb')
        const model = new Nedb(
          t.merge(
            {
              filename: fs.path(config, `${name}.db`),
              timestampData: true,
              autoload: true,
            },
            factory
          )
        )
        dbTasks.addModel('nedb', name, model)
      },
      service(name, factory, props) {
        const adapter = dbTasks.getAdapter('nedb')
        if (t.isNill(factory)) {
          return null
        }
        return FeathersNedb(factory(adapter.models))
      },
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [adapter]),
  })
})

export const apiBox = apiBoxCore(withNedbAdapter())
