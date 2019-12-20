import { apiBoxCore, task, fs } from '@z1/lib-api-box-core'
import { Sequelize, FeathersSequelize } from '@z1/preset-feathers-server-sql'

// tasks
import { createDBConnection } from './tasks'

// main
export const withSequelizeAdapter = task(t => (ctx = {}) => {
  const adapterName = 'sequelize'
  const adapters = t.pathOr([], ['adapters'], ctx)
  const sequelizeAdapter = app => {
    const dbTools = app.get('dbTools')
    dbTools.set(adapterName, {
      associate: [],
      service(name, factory, hooksEvents) {
        return {
          name,
          factory,
          hooksEvents,
        }
      },
      beforeSetup() {
        const sequelize = createDBConnection(app)
        const adapter = dbTools.get(adapterName)
        const define = sequelize.define.bind(sequelize)
        t.forEach(modelName => {
          const modelFactory = adapter.models[modelName]
          modelFactory(
            (fields, props) => {
              if (t.has('associate')(props)) {
                const currentList = t.pathOr([], ['associate'], adapter)
                const currentAdapter = dbTools.get(adapterName)
                dbTools.set(
                  adapterName,
                  t.merge(currentAdapter, {
                    associate: t.concat(currentList, [props.associate]),
                  })
                )
              }
              define(modelName, fields, t.omit(['associate'], props))
            },
            Sequelize.DataTypes,
            Sequelize
          )
        }, t.keys(adapter.models || {}))
        const nextModels = sequelize.models
        const connection = {
          client: sequelize,
          lib: Sequelize,
        }
        dbTools.set(
          adapterName,
          t.mergeAll([adapter, { models: nextModels }, connection])
        )
        t.forEach(serviceName => {
          const serviceDef = adapter.services[serviceName]
          const serviceProps = serviceDef.factory(nextModels)
          const nextServiceName = app.get('serviceTools').safeServiceName(serviceName)
          app.use(
            `/${nextServiceName}`,
            FeathersSequelize(
              t.mergeAll([
                { name: nextServiceName },
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
        const adapter = dbTools.get(adapterName)
        t.forEach(associate => {
          if (t.isType(associate, 'Function')) {
            associate(adapter.client.models)
          }
        }, adapter.associate || [])

        // Sync to the database
        const config = dbTools.dbConfig(adapterName)
        const forceAlter = t.has('forceAlter')(config)
          ? config.forceAlter
          : false
        const syncOptions = forceAlter
          ? { alter: true }
          : t.eq(process.env.NODE_ENV, 'development')
          ? { alter: true }
          : { force: false }

        adapter.client
          .sync(syncOptions)
          .then(() => {
            t.forEach(action => {
              action('onSync', app)
            }, boxes.lifecycle || [])
          })
          .catch(error => {
            app.error('FAILED TO SYNC DB', error)
          })
      },
    })
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [sequelizeAdapter]),
  })
})

export const apiBox = apiBoxCore(withSequelizeAdapter())
