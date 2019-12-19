import { apiBoxCore, fn, fs } from '@z1/lib-api-box-core'
import { Sequelize, FeathersSequelize } from '@z1/preset-feathers-server-sql'

// tasks
import { createDbConnection } from './tasks'

// main
export const withSequelizeAdapter = fn(t => (ctx = {}) => {
  const adapters = t.pathOr([], ['adapters'], ctx)
  const adapter = app => {
    const dbTasks = app.get('dbTasks')
    return {
      name: 'sequelize',
      beforeSetup(boxes) {
         // configure DB connection
      const sequelize = createDBConnection(app)
      // persist db instance
      app.set('sequelizeClient', sequelize)
      app.set('Sequelize', Sequelize)
      // define models
      const define = sequelize.define.bind(sequelize)
      t.forEach(model => {
        if (t.isType(model, 'Function')) {
          model(define)
        }
      }, boxes.models || [])
      },
      onSetup(boxes) {
        const sequelize = app.get('sequelizeClient')
        const models = sequelize.models
  
        t.forEachObjIndexed(model => {
          if (t.has('associate')(model)) {
            model.associate(models)
          }
        }, models || {})
  
        // Sync to the database
        const db = app.get('db')
        const forceAlter = t.has('forceAlter')(db) ? db.forceAlter : false
        const syncOptions = forceAlter
          ? { alter: true }
          : t.eq(process.env.NODE_ENV, 'development')
          ? { alter: true }
          : { force: false }
  
        sequelize
          .sync(syncOptions)
          .then(() => {
            // lifecycle onSync
            t.forEach(action => {
              action('onSync', app)
            }, boxes.lifecycle || [])
          })
          .catch(error => {
            app.error('FAILED TO SYNC DB', error)
          })
      },
      afterSetup(boxes) {},
      model(name, factory = {}) {},
      service(name, factory, props) {},
    }
  }
  return t.merge(ctx, {
    adapters: t.concat(adapters, [adapter]),
  })
})

export const apiBox = apiBoxCore(withSequelizeAdapter())
