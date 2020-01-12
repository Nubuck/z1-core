import { apiBoxCore, task as Fn, fs as Fs } from '@z1/lib-api-box-core'
import { Sequelize, FeathersSequelize } from '@z1/preset-feathers-server-sql'
import { Knex, FeathersKnex } from '@z1/preset-feathers-server-sql'

// tasks
import { createDBConnection } from './db'

// main
export const withSequelizeAdapter = Fn(t => (ctx = {}) => {
  const adapterName = 'sequelize'
  const adapters = t.pathOr([], ['adapters'], ctx)
  const sequelizeAdapter = app => {
    const dbTools = app.get('dbTools')
    return {
      name: adapterName,
      associate: [],
      beforeSetup() {
        const sequelize = createDBConnection(app)
        if (t.not(t.isNil(sequelize))) {
          app.debug('Sequelize client skipped')
          const adapter = dbTools.get(adapterName)
          if (t.notZeroLen(t.keys(adapter.models || {}))) {
            const define = sequelize.define.bind(sequelize)
            // register models
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
            // register services
            const serviceModelProps = (factoryObj = {}) => {
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
              if (t.not(t.isNil(serviceProps))) {
                app.use(
                  `/${nextServiceName}`,
                  FeathersSequelize(
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
          } else {
            app.debug('No Sequelize models detected, skipping before setup')
          }
        }
      },
      onSetup(boxes) {
        const adapter = dbTools.get(adapterName)
        if (t.not(t.isNil(adapter.client))) {
          if (t.notZeroLen(t.keys(adapter.models || {}))) {
            t.forEach(associate => {
              if (t.isType(associate, 'Function')) {
                associate(adapter.client.models)
              }
            }, adapter.associate || [])

            // Sync props
            const config = dbTools.dbConfig(adapterName)
            const forceAlter = t.has('forceAlter')(config)
              ? config.forceAlter
              : false
            const syncOptions = forceAlter
              ? { alter: true }
              : t.eq(process.env.NODE_ENV, 'development')
              ? { alter: true }
              : { force: false }

            // Sync
            adapter.client
              .sync(syncOptions)
              .then(() => {
                boxes.lifecycle('onSync')(app)
              })
              .catch(error => {
                app.error('FAILED TO SYNC DB', error)
              })
          } else {
            app.debug('No Sequelize models detected, skipping after setup')
          }
        }
      },
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [sequelizeAdapter]),
  })
})

export const withKnexAdapter = Fn(t => (ctx = {}) => {
  const adapterName = 'knex'
  const adapters = t.pathOr([], ['adapter'], ctx)
  const knexAdapter = app => {
    const dbTools = app.get('dbTools')
    return {
      name: adapterName,
      beforeSetup() {
        // const sequelize = createDBConnection(app)
        // const adapter = dbTools.get(adapterName)
        // const define = sequelize.define.bind(sequelize)

        // register models
        t.forEach(modelName => {
          // const modelFactory = adapter.models[modelName]
          // modelFactory(
          //   (fields, props) => {
          //     if (t.has('associate')(props)) {
          //       const currentList = t.pathOr([], ['associate'], adapter)
          //       const currentAdapter = dbTools.get(adapterName)
          //       dbTools.set(
          //         adapterName,
          //         t.merge(currentAdapter, {
          //           associate: t.concat(currentList, [props.associate]),
          //         })
          //       )
          //     }
          //     define(modelName, fields, t.omit(['associate'], props))
          //   },
          //   Sequelize.DataTypes,
          //   Sequelize
          // )
        }, t.keys(adapter.models || {}))
        // const nextModels = sequelize.models
        // const connection = {
        //   client: sequelize,
        //   lib: Sequelize,
        // }
        // dbTools.set(
        //   adapterName,
        //   t.mergeAll([adapter, { models: nextModels }, connection])
        // )

        // register services
        t.forEach(serviceName => {
          //   const serviceDef = adapter.services[serviceName]
          //   const serviceProps = serviceDef.factory(nextModels)
          //   const nextServiceName = app
          //     .get('serviceTools')
          //     .safeServiceName(serviceName)
          //   app.use(
          //     `/${nextServiceName}`,
          //     FeathersSequelize(
          //       t.mergeAll([
          //         serviceProps,
          //         {
          //           paginate: t.has('paginate')(serviceProps)
          //             ? serviceProps.paginate
          //             : app.get('paginate'),
          //         },
          //       ])
          //     )
          //   )
          //   dbTools.services.wire(nextServiceName, serviceDef.hooksEvents)
        }, t.keys(adapter.services || {}))
      },
      onSetup(boxes) {
        const adapter = dbTools.get(adapterName)
        // t.forEach(associate => {
        //   if (t.isType(associate, 'Function')) {
        //     associate(adapter.client.models)
        //   }
        // }, adapter.associate || [])

        // Sync to the database
        const config = dbTools.dbConfig(adapterName)
        // const forceAlter = t.has('forceAlter')(config)
        //   ? config.forceAlter
        //   : false
        // const syncOptions = forceAlter
        //   ? { alter: true }
        //   : t.eq(process.env.NODE_ENV, 'development')
        //   ? { alter: true }
        //   : { force: false }

        // adapter.client
        //   .sync(syncOptions)
        //   .then(() => {
        boxes.lifecycle('onSync')(app)
        // })
        // .catch(error => {
        //   app.error('FAILED TO SYNC DB', error)
        // })
      },
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [knexAdapter]),
  })
})

const abx = apiBoxCore(withSequelizeAdapter())
export const apiBox = abx
export const task = Fn
export const fn = Fn
export const fs = Fs
export { FeathersErrors } from '@z1/lib-api-box-core'
export default abx
