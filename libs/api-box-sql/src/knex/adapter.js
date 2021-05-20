import { task as Fn } from '@z1/lib-api-box-core'
import { Knex, FeathersKnex } from '@z1/preset-feathers-server-sql'

// main
export const withKnexAdapter = Fn((t, a) => (ctx = {}) => {
  const adapterName = 'knex'
  const adapters = t.atOr([], 'adapter', ctx)
  const knexAdapter = (app) => {
    const dbTools = app.get('dbTools')
    return {
      name: adapterName,
      beforeSetup() {
        const adapter = dbTools.get(adapterName)
        const config = dbTools.dbConfig(adapterName)
        const knexClient = Knex(config)
        dbTools.set(adapterName, t.merge(adapter, { client: knexClient }))
        // register services
        const serviceModelProps = (factoryObj = {}) => {
          const modelName = t.atOr(null, 'modelName', factoryObj)
          if (t.isNil(modelName)) {
            return null
          }
          return t.merge(
            { Model: knexClient, name: modelName, id: '_id' },
            t.omit(['modelName'], factoryObj)
          )
        }
        t.forEach((serviceName) => {
          const serviceDef = adapter.services[serviceName]
          const serviceProps = t.isType(serviceDef.factory, 'function')
            ? serviceDef.factory(knexClient)
            : serviceModelProps(serviceDef.factory)
          const nextServiceName = app
            .get('serviceTools')
            .safeServiceName(serviceName)
          if (t.notNil(serviceProps)) {
            app.use(
              `/${nextServiceName}`,
              FeathersKnex(
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
          }
        }, t.keys(adapter.services || {}))
      },
      onSetup(boxes) {
        const adapter = dbTools.get(adapterName)
        const config = dbTools.dbConfig(adapterName)
        const knexClient = Knex(config)
        dbTools.set(adapterName, t.merge(adapter, { client: knexClient }))
        // register models
        a.map(t.keys(adapter.models || {}), 1, async (modelName) => {
          const modelFactory = t.at(modelName, adapter.models)
          const [modelErr] = await a.of(modelFactory(knexClient))
          if (modelErr) {
            app.error('Knex model setup error', modelErr)
          }
          return null
        })
          .then(() => {
            // sync boxes
            boxes.lifecycle('onSync')(app)
            if (t.notNil(app.setupComplete)) {
              app.setupComplete()
            }
          })
          .catch((adapterErr) => {
            app.error('Knex adapter setup error', adapterErr)
          })
      },
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [knexAdapter]),
  })
})
