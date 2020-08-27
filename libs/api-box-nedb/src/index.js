import { apiBoxCore, task as Fn, fs as Fs } from '@z1/lib-api-box-core'
import { Nedb, FeathersNedb } from '@z1/preset-feathers-server-nedb'

// main
export const withNedbAdapter = Fn(t => (ctx = {}) => {
  const adapterName = 'nedb'
  const adapters = t.atOr([], 'adapters', ctx)
  const nedbAdapter = app => {
    const dbTools = app.get('dbTools')
    return {
      name: adapterName,
      beforeSetup(boxes) {
        const config = dbTools.dbConfig(adapterName)
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
          define(modelName)
        }, t.keys(adapter.models || {}))
        // register services
        const nextModels = dbTools.models.get(adapterName)
        const serviceModelProps = (factoryObj = {}) => {
          const modelName = t.atOr(null, 'modelName', factoryObj)
          if (t.isNil(modelName)) {
            return {}
          }
          const Model = t.atOr(null, modelName, nextModels)
          if (t.isNil(Model)) {
            return {}
          }
          return t.merge({ Model }, t.omit(['modelName'], factoryObj))
        }
        t.forEach(serviceName => {
          const serviceDef = adapter.services[serviceName]
          const serviceProps = t.isType(serviceDef.factory, 'function')
            ? serviceDef.factory(nextModels)
            : serviceModelProps(serviceDef.factory)
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
        boxes.lifecycle('onSync')(app)
      },
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [nedbAdapter]),
  })
})

const abx = apiBoxCore(withNedbAdapter())
export const apiBox = abx
export const task = Fn
export const fn = Fn
export const fs = Fs
export default abx
