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
        console.log('adapter', adapter)
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
          console.log('Model', config, model)
          dbTools.models.add(adapterName, name, model)
        }
        // register models
        t.forEach(modelName => {
          // const modelFactory = adapter.models[modelName]
          // modelFactory && modelFactory(define)
          define(modelName)
        }, t.keys(adapter.models || {}))
        // register services
        const nextModels = dbTools.models.get(adapterName)
        const serviceModelProps = (factoryObj = {}) => {
          console.log('Factory Obj', Nedb, nextModels, factoryObj)
          const modelName = t.pathOr(null, ['modelName'], factoryObj)
          if (t.isNil(modelName)) {
            return null
          }
          const Model = t.pathOr(null, [modelName], nextModels)
          if (t.isNil(Model)) {
            return null
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
export { FeathersErrors } from '@z1/lib-api-box-core'
export default abx
