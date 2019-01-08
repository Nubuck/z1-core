import {
  Feathers,
  FeathersExpress,
  FeathersSocketIO,
  FeathersConfig,
  FeathersAuth,
  FeathersAuthJWT,
  FeathersAuthLocal,
  Sequelize,
  FeathersSequelize,
  FeathersCommonHooks,
  FeathersAuthHooks,
  Cors,
  Compression,
  Winston,
  FeathersErrors,
  FeathersLogger,
} from '@z1/preset-feathers-server'
import { task } from '@z1/preset-task'
import { Fs } from '@z1/preset-tools'
import { createServer } from 'http'
import Fallback from 'express-history-api-fallback'
import uuidv4 from 'uuid/v4'

// quick exports
export { FeathersErrors } from '@z1/preset-feathers-server'

// defs
const operatorsAliases = {
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

// main
const createModel = task(
  t => (name, props, options = {}) => define => {
    if (t.has('associate')(options)) {
      const model = define(
        name,
        props,
        t.omit([ 'associate' ], options),
      )
      model.associate = options.associate
      return model
    }
    return define(name, props, options)
  },
)

const hookSignature = task(
  t => def => t.has('before')(def)
    || t.has('after')(def)
    || t.has('error')(def),
)

const hookAndEventSignature = task(
  t => def => t.has('hooks')(def)
    || t.has('events')(def),
)

const safeServiceName = task(
  t => path => t.and(
    t.startsWith('/', path),
    t.endsWith('/', path),
  )
    ? t.valPipe(path)(t.tail, t.dropLast(1))
    : t.startsWith('/', path)
      ? t.tail(path)
      : t.endsWith('/', path)
        ? t.dropLast(1, path)
        : path,
)

// INTERFACE:
// name: string
// service: object or function
// -> object:
// { Model: SequelizeModel, paginate:{} ... }
// -> function:
// app => {}
// modifier: object
// -> hooks:
// {
//    before: {
//      get: [],
//      find: [],
//      create: [],
//      patch: [],
//      remove: []
//    },
//    after: {
//      get: [],
//      find: [],
//      create: [],
//      patch: [],
//      remove: []
//    },
// }
// -> events:
// {
//    created(data, app){},
//    updated(data, app) {},
//    patched(data, app){},
//    removed(data, app){}
// }
const createService = task(
  t => (
    name,
    service,
    modifier = undefined,
  ) => app => {
    if (t.isType(service, 'Function')) {
      app.configure(a => service(
        a,
        props => FeathersSequelize(
          t.merge(
            props,
            {
              name,
              paginate: t.has('paginate')(props)
                ? props.paginate
                : app.get('paginate'),
            },
          ),
        ),
      ))
    }
    else {
      const nextService = t.has('Model')(service)
        ? FeathersSequelize(t.merge(
          t.omit([ 'Model', 'paginate' ], service),
          {
            name,
            Model: service.Model,
            paginate: t.has('paginate')(service)
              ? service.paginate
              : app.get('paginate'),
          },
        ))
        : service
      app.use(`/${safeServiceName(name)}`, nextService)
    }
    const registeredService = app.service(name)
    if (t.and(modifier, registeredService)) {
      if (hookSignature(modifier)) {
        registeredService.hooks(modifier)
      }
      else if (hookAndEventSignature(modifier)) {
        if (t.has('hooks')(modifier)) {
          registeredService.hooks(modifier.hooks)
        }
        if (t.has('events')(modifier)) {
          if (t.isType(modifier.events, 'Object')) {
            t.forEach(eventKey => {
              registeredService.on(
                eventKey,
                (data, context) => {
                  t.path([ eventKey ], modifier.events)(data, context)
                },
              )
            }, t.keys(modifier.events))
          }
        }
      }
    }
    return registeredService
  },
)

const commonHooks = task(
  t => (
    {
      auth: t.mergeAll([
        FeathersAuth.hooks,
        FeathersAuthLocal.hooks,
        FeathersAuthHooks,
      ]),
      common: FeathersCommonHooks,
      data: {
        withIdUUIDV4: task(
          t => hook => {
            if (t.and(
                t.eq(hook.type, 'before'),
                t.eq(hook.method, 'create'),
              )) {
              hook.data.id = uuidv4()
            }
            return hook
          },
        ),
        withUUIDV4: task(
          t => field => hook => {
            if (t.and(
                t.eq(hook.type, 'before'),
                t.eq(hook.method, 'create'),
              )) {
              hook.data[ field ] = uuidv4()
            }
            return hook
          },
        ),
        safeFindMSSQL: task(
          t => hook => {
            const db = hook.app.get('db')
            if (t.eq('find', hook.method)) {
              if (t.eq('mssql', db.dialect)) {
                if (t.not(t.path([ 'params', 'query', '$sort' ], hook))) {
                  if (t.not(t.has('params')(hook))) {
                    hook.params = {
                      query: {
                        $sort: { id: 1 },
                      },
                    }
                  }
                  else if (t.not(t.has('query')(hook.params))) {
                    hook.params.query = {
                      $sort: { id: 1 },
                    }
                  }
                  else {
                    hook.params.query.$sort = { id: 1 }
                  }
                }
              }
            }
            return hook
          },
        ),
      },
    }
  ),
)

// INTERFACE:
// models(createModel, SequelizeTypes, SequelizeLiteral)
// services(createService, models, hooks: { data, auth, common })
// channels(app)
// lifecycle: {
//    beforeConfig(app) {},
//    authConfig(app) {},
//    afterConfig(app) {},
//    onSetup(app) {},
//    onStart(app) {},
// }
export const createApiBox = task(
  t => ({
    models,
    services,
    channels,
    lifecycle,
  }) => {
    return {
      models: t.notType(models, 'Function')
        ? undefined
        : define => t.map(model => model(define))(
          models(createModel, Sequelize.DataTypes, Sequelize.literal) || [],
        )
      ,
      services: t.notType(services, 'Function')
        ? undefined
        : (app, models) => t.map(service => service(app))(
          services(
            createService,
            models,
            commonHooks,
          ) || [],
        ),
      channels: t.notType(channels, 'Function')
        ? undefined
        : app => {
          channels(app)
        },
      lifecycle: t.notType(lifecycle, 'Object')
        ? undefined
        : (key, app) => {
          if (t.isType(t.path([ key ], lifecycle), 'Function')) {
            t.path([ key ], lifecycle)(app)
          }
        },
    }
  },
)

const createDBConnection = task(
  t => app => {
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
      return new Sequelize(t.mergeAll([
        dbConfig,
        baseSQLProps,
        db,
      ]))
    }
    else {
      return new Sequelize(
        dbConfig,
        t.merge(
          baseSQLProps,
          { dialect: db.dialect },
        ),
      )
    }
  },
)

// INTERFACE:
// boxes: array of api boxes from createApiBox({...}) or composeApiBox({...},[...])
export const combineApiBoxes = task(
  t => boxes => {
    const nextBoxes = t.reduce(
      (collection, box) => {
        return {
          models: t.notType(box.models, 'Function')
            ? collection.models
            : t.concat(collection.models, [ box.models ]),
          services: t.notType(box.services, 'Function')
            ? collection.services
            : t.concat(collection.services, [ box.services ]),
          channels: t.notType(box.channels, 'Function')
            ? collection.channels
            : t.concat(collection.channels, [ box.channels ]),
          lifecycle: t.notType(box.lifecycle, 'Function')
            ? collection.lifecycle
            : t.concat(collection.lifecycle, [ box.lifecycle ]),
        }
      },
      {
        models: [],
        services: [],
        channels: [],
        lifecycle: [],
      },
      boxes,
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
        // configure DB connection
        const sequelize = createDBConnection(app)

        // configure if config file contains valid keys
        if (t.not(t.eq(sequelize, null))) {
          // persist db instance
          app.set('sequelizeClient', sequelize)
          // define models
          const define = sequelize
            .define
            .bind(sequelize)
          t.forEach(model => {
            if (t.isType(model, 'Function')) {
              model(define)
            }
          }, nextBoxes.models)

          // associate models on setup
          const oldSetup = app.setup
          app.setup = function (...args) {
            const result = oldSetup.apply(this, args)

            // Set up data relationships
            const models = sequelize.models

            t.forEachObjIndexed(model => {
              if (t.has('associate')(model)) {
                model.associate(models)
              }
            }, models || {})

            // Sync to the database
            const db = app.get('db')
            const forceAlter = t.has('forceAlter')(db)
              ? db.forceAlter
              : false
            const syncOptions = forceAlter
              ? { alter: true }
              : t.eq(process.env.NODE_ENV, 'development')
                ? { alter: true }
                : { force: false }

            sequelize.sync(syncOptions)
              .then(() => {
                // lifecycle onSync
                t.forEach(action => {
                  action('onSync', app)
                }, nextBoxes.lifecycle)
              })
              .catch(error => {
                app.error('FAILED TO SYNC DB', error)
              })

            // lifecycle onSetup
            t.forEach(action => {
              action('onSetup', app)
            }, nextBoxes.lifecycle)

            return result
          }

          // register services
          t.forEach(service => {
            if (t.isType(service, 'Function')) {
              service(app, sequelize.models)
            }
          }, nextBoxes.services)

        }
      },
    }
  },
)

const defaultChannelConfig = function (app) {

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(channel));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(channel);
      // app.channel(`userIds/$(user.id}`).join(channel);
    }
  })

  // eslint-disable-next-line no-unused-vars
  app.publish((data, hook) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`
    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated')
  })

}

const configureChannels = task(
  t => (channels) => app => {
    if (t.notType(app.channel, 'Function')) {
      // If no real-time functionality has been configured
      // just return
      return null
    }
    if (t.isZeroLen(channels)) {
      defaultChannelConfig(app)
    }
    else {
      t.forEach(channel => {
        channel(app)
      }, channels || [])
    }
  },
)
const authConfig = task(
  t => app => {
    const config = app.get('authentication')
    return t.merge(config, {
      path: `/${safeServiceName(config.path)}`,
    })
  },
)
const configureAuthentication = task(
  t => function (app, lifecycle) {
    const config = authConfig(app)
    // Set up authentication with the secret
    app.configure(FeathersAuth(config))
    app.configure(FeathersAuthJWT())
    app.configure(FeathersAuthLocal())
    app.configure(lifecycle)
    // The `authentication` service is used to create a JWT.
    // The before `create` hook registers strategies that can be used
    // to create a new valid JWT (e.g. local or oauth2)
    app.service('authentication')
      .hooks({
        before: {
          create: [
            commonHooks
              .auth
              .authenticate(config.strategies),
          ],
          remove: [
            commonHooks
              .auth
              .authenticate('jwt'),
          ],
        },
      })
  },
)

// INTERFACE:
// namespace: string, to mount api on path
// boxes: array of api boxes from createApiBox({...}) or composeApiBox({...},[...])
// middleware(app){}
// hooks: { before: {...}, after: {...} }
// channels(app){}
export const createApi = task(
  t => function ({
    namespace,
    boxes,
    middleware,
    hooks,
    channels,
  }) {
    // Parse props
    const nextBoxes = t.isType(boxes, 'Object')
      ? boxes
      : combineApiBoxes(boxes)

    // Create feathers app with Express engine
    const api = FeathersExpress(Feathers())

    // Load app FeathersConfig
    // NOTE: https://github.com/lorenwest/node-config/wiki/Configuration-Files
    api.configure(FeathersConfig())
    api.configure(FeathersLogger(Winston))
    // Enable Cors, security, compression, favicon and body parsing
    if (t.not(namespace)) {
      api.use(Cors())
      api.use(Compression())
      api.use(FeathersExpress.json())
      api.use(FeathersExpress.urlencoded({ extended: true }))
    }
    // Set up Plugins and providers
    api.configure(FeathersExpress.rest())
    api.configure(FeathersSocketIO())

    // Lifecycle before
    api.configure(nextBoxes.lifecycle('beforeConfig'))

    // Configure authentication
    if (api.get('authentication')) {
      api.configure(
        app => configureAuthentication(
          app,
          nextBoxes.lifecycle('authConfig'),
        ),
      )
    }

    // Configure boxes
    api.configure(nextBoxes.configure)

    // Configure channels
    api.configure(configureChannels(
      t.concat(
        t.isType(channels, 'Function')
          ? [ channels ]
          : [],
        nextBoxes.collection.channels || [],
      ),
    ))

    // Host the public folder
    if (api.get('public')) {
      api.use('/', FeathersExpress.static(api.get('public')))
    }

    // Configure other middleware
    if (t.isType(middleware, 'Function')) {
      api.configure(middleware)
    }

    // Configure a middleware for 404s and the error handler
    api.use(FeathersExpress.notFound())
    api.use(FeathersExpress.errorHandler({ logger: Winston }))

    // Attach global hooks
    if (t.isType(hooks, 'Object')) {
      api.hooks(hooks)
    }

    // Lifecycle after and onStart
    api.configure(nextBoxes.lifecycle('afterConfig'))
    api.onStart = () => {
      nextBoxes.lifecycle('onStart')(api)
    }

    // yield
    return api
  },
)

const pathIncludeNamespace = task(
  t => (path, namespace) => {
    if (t.not(path)) {
      return false
    }
    if (t.not(t.isType(path, 'String'))) {
      return false
    }
    return path.includes(namespace)
  },
)

export const createApiServer = task(
  t => function (props = {}, server = undefined) {
    try {
      // check props for namespace and site
      const namespace = t.path([ 'namespace' ], props)
      const appFolderName = t.path([ 'appFolderName' ], props)
      const middleware = t.path([ 'middleware' ], props)
      if (t.and(
          t.isType(namespace, 'String'),
          t.isType(appFolderName, 'String'),
        )) {
        // if found add history fallback api + static
        props = t.merge(props, {
          middleware(app) {
            const root = Fs.path(appFolderName)
            const safeNamespace = `/${safeServiceName(namespace)}`
            app.use(safeNamespace, FeathersExpress.static(root))
            app.use(safeNamespace, (req, res, next) => {
              app.log('APP REQUEST -> ', req.originalUrl, namespace)
              if (t.not(pathIncludeNamespace(req.originalUrl, namespace))) {
                next()
              }
              else {
                Fallback('index.html', { root })(req, res, next)
              }
            })
            if (t.isType(middleware, 'Function')) {
              middleware(app)
            }
          },
        })
      }
      const api = createApi(props)
      if (t.not(server)) {
        server = createServer(api)
      }
      return {
        namespace: null,
        main: t.not(server)
          ? createServer(api)
          : null,
        api,
        server,
      }
    }
    catch (e) {
      console.log('ERROR BOOTING APP', e)
      throw e
    }
  },
)

export const runServer = task(
  t => (app, cb) => {
    app.api.setup(app.server)
    app.server.listen(app.api.get('port'), () => {
      if (t.isType(app.api.onStart, 'Function')) {
        app.api.onStart()
      }
      if (t.isType(cb, 'Function')) {
        cb(app)
      }
    })
    return app
  },
)

export const reloadServer = function (app, props) {
  app.server.removeListener('request', app.api)
  delete app.api
  const nextApp = createApiServer(props, app.server)
  app.server.on('request', nextApp.api)
  nextApp.api.setup(app.server)
  return nextApp
}

export const createAppServer = task(
  t => (props, cb) => {
    // check for namespace and configure props
    // -> create main app and mount api at namespace
    const namespace = t.path([ 'namespace' ], props)
    const appFolderName = t.path([ 'appFolderName' ], props)
    const configure = t.path([ 'configure' ], props)
    const api = createApi(props)
    const main = FeathersExpress()
    main.use(Cors())
    main.use(Compression())
    main.use(FeathersExpress.json())
    main.use(FeathersExpress.urlencoded({ extended: true }))
    main.use(`/${safeServiceName(namespace)}`, api)
    if (appFolderName) {
      if (t.isType(appFolderName, 'String')) {
        const root = Fs.path(appFolderName)
        main.use(FeathersExpress.static(root))
        main.use((req, res, next) => {
          api.log('APP REQUEST -> ', req.originalUrl, namespace)
          if (pathIncludeNamespace(req.originalUrl, namespace)) {
            next()
          }
          else {
            Fallback('index.html', { root })(req, res, next)
          }
        })
      }
    }
    if (t.isType(configure, 'Function')) {
      configure(main, api)
    }
    const server = main.listen(api.get('port'), () => {
      if (t.isType(api.onStart, 'Function')) {
        api.onStart()
      }
      if (t.isType(cb, 'Function')) {
        cb(api)
      }
    })
    api.setup(server)
    return {
      namespace,
      main,
      api,
      server,
    }
  },
)

export const reloadAppServer = task(
  t => (app, props) => {
    app.server.removeListener('request', app.api)
    delete app.api
    const api = createApi(props)
    app.server.on('request', api)
    api.setup(app.server)
    app.api = api
    return app
  },
)

export const appMiddleware = {
  serve: FeathersExpress.static,
  fallback: Fallback,
}

export const fs = Fs