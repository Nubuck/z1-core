import { apiBoxCore, task as Fn, fs as Fs } from '@z1/lib-api-box-core'
import { Nedb, FeathersNedb } from '@z1/preset-feathers-server-nedb'

// main
export const withNedbAdapter = Fn(t => (ctx = {}) => {
  const adapterName = 'nedb'
  const adapters = t.pathOr([], ['adapters'], ctx)
  const nedbAdapter = app => {
    const dbTools = app.get('dbTools')
    return {
      name: adapterName,
      beforeSetup(boxes) {
        const config = dbTools.dbConfig('nedb')
        Fs.dir(config || adapterName)
        const adapter = dbTools.get(adapterName)
        const define = (name, opts = {}) => {
          const model = new Nedb(
            t.merge(
              {
                filename: Fs.path(config, `${name}.db`),
                timestampData: true,
                autoload: true,
              },
              opts
            )
          )
          dbTools.models.add(adapterName, name, model)
        }
        // register models
        t.forEach(modelName => {
          const modelFactory = adapter.models[modelName]
          modelFactory && modelFactory(define)
        }, t.keys(adapter.models || {}))
        // register services
        const nextModels = dbTools.models.get(adapterName)
        t.forEach(serviceName => {
          const serviceDef = adapter.services[serviceName]
          const serviceProps = serviceDef.factory(nextModels)
          const nextServiceName = app
            .get('serviceTools')
            .safeServiceName(serviceName)
          app.use(
            `/${nextServiceName}`,
            FeathersNedb(
              t.mergeAll([
                serviceProps,
                {
                  paginate: t.has('paginate')(serviceProps)
                    ? serviceProps.paginate
                    : app.get('paginate'),
                },
              ])
            )
          )
          dbTools.services.wire(nextServiceName, serviceDef.hooksEvents)
        }, t.keys(adapter.services || {}))
      },
      onSetup(boxes) {
        t.forEach(action => {
          action('onSync', app)
        }, boxes.lifecycle)
      },
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [adapter]),
  })
})

export const apiBox = apiBoxCore(withNedbAdapter())
export const task = Fn
export const fn = Fn
export const fs = Fs
export { FeathersErrors } from '@z1/lib-api-box-core'