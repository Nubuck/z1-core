import { task } from '@z1/preset-task'
import { Sequelize, FeathersSequelize } from '@z1/preset-feathers-server-sql'
import {
  makeCreateService,
  makeCreateApiBox,
  makeComposeApiBox,
  makeCombineApiBoxes,
  makeCreateApi,
  makeCreateApiServer,
  makeReloadServer,
  makeCreateAppServer,
  makeReloadAppServer,
} from '@z1/lib-api-box-core'

// defs
export const operatorsAliases = {
  $eq: Sequelize.Op.eq,
  $ne: Sequelize.Op.ne,
  $gte: Sequelize.Op.gte,
  $gt: Sequelize.Op.gt,
  $lte: Sequelize.Op.lte,
  $lt: Sequelize.Op.lt,
  $not: Sequelize.Op.not,
  $in: Sequelize.Op.in,
  $notIn: Sequelize.Op.notIn,
  $is: Sequelize.Op.is,
  $like: Sequelize.Op.like,
  $notLike: Sequelize.Op.notLike,
  $iLike: Sequelize.Op.iLike,
  $notILike: Sequelize.Op.notILike,
  $regexp: Sequelize.Op.regexp,
  $notRegexp: Sequelize.Op.notRegexp,
  $iRegexp: Sequelize.Op.iRegexp,
  $notIRegexp: Sequelize.Op.notIRegexp,
  $between: Sequelize.Op.between,
  $notBetween: Sequelize.Op.notBetween,
  $overlap: Sequelize.Op.overlap,
  $contains: Sequelize.Op.contains,
  $contained: Sequelize.Op.contained,
  $adjacent: Sequelize.Op.adjacent,
  $strictLeft: Sequelize.Op.strictLeft,
  $strictRight: Sequelize.Op.strictRight,
  $noExtendRight: Sequelize.Op.noExtendRight,
  $noExtendLeft: Sequelize.Op.noExtendLeft,
  $and: Sequelize.Op.and,
  $or: Sequelize.Op.or,
  $any: Sequelize.Op.any,
  $all: Sequelize.Op.all,
  $values: Sequelize.Op.values,
  $col: Sequelize.Op.col,
  $join: Sequelize.Op.join,
}

// models
const createModel = task(t => (name, props, options = {}) => define => {
  if (t.has('associate')(options)) {
    const model = define(name, props, t.omit(['associate'], options))
    model.associate = options.associate
    return model
  }
  return define(name, props, options)
})

const createDBConnection = task(t => app => {
  const db = app.get('db')
  const dbConfig = app.get(db.dialect)
  if (t.not(dbConfig)) {
    return null
  }
  const baseSQLProps = {
    logging: false,
    operatorsAliases,
    define: {
      freezeTableName: true,
    },
  }
  if (t.isType(dbConfig, 'Object')) {
    return new Sequelize(t.mergeAll([dbConfig, baseSQLProps, db]))
  } else {
    return new Sequelize(
      dbConfig,
      t.merge(baseSQLProps, { dialect: db.dialect })
    )
  }
})

// box
const createService = makeCreateService(FeathersSequelize)
export const createApiBox = task(t =>
  makeCreateApiBox(
    models => define =>
      t.map(model => model(define))(
        models(createModel, Sequelize.DataTypes, Sequelize) || []
      ),
    createService
  )
)
export const composeApiBox = makeComposeApiBox(createApiBox)
export const combineApiBoxes = task(t =>
  makeCombineApiBoxes({
    beforeSetup(app, boxes) {
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
    onSetup(app, boxes) {
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
    getModels(app) {
      const sequelize = app.get('sequelizeClient')
      return sequelize.models
    },
  })
)
// api
export const createApi = makeCreateApi(combineApiBoxes)
// server
export const createApiServer = makeCreateApiServer(createApi)
export const reloadApiServer = makeReloadServer(createApi)
export const createAppServer = makeCreateAppServer(createApi)
export const reloadAppServer = makeReloadAppServer(createApi)
