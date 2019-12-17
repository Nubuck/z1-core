import { task } from '@z1/preset-task'
import {
  Feathers,
  FeathersExpress,
  FeathersSocketIO,
  FeathersConfig,
  FeathersAuth,
  FeathersAuthJWT,
  FeathersAuthLocal,
  Cors,
  Compression,
  Winston,
  FeathersLogger,
} from '@z1/preset-feathers-server-core'

// parts
import { commonHooks, safeServiceName } from './common'

// channels
const defaultChannelConfig = function(app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return
  }

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
const configureChannels = task(t => channels => app => {
  if (t.notType(app.channel, 'Function')) {
    // If no real-time functionality has been configured
    // just return
    return null
  }
  if (t.isZeroLen(channels)) {
    defaultChannelConfig(app)
  } else {
    t.forEach(channel => {
      channel(app)
    }, channels || [])
  }
})

// auth
const authConfig = task(t => app => {
  const config = app.get('authentication')
  return t.merge(config, {
    path: `/${safeServiceName(config.path)}`,
  })
})
const configureAuthentication = task(
  t =>
    function(app, lifecycle, authHooks) {
      const config = authConfig(app)
      // Set up authentication with the secret
      app.configure(FeathersAuth(config))
      app.configure(FeathersAuthJWT())
      app.configure(FeathersAuthLocal())
      app.configure(lifecycle)
      // The `authentication` service is used to create a JWT.
      // The before `create` hook registers strategies that can be used
      // to create a new valid JWT (e.g. local or oauth2)
      const nextHooks = t.isType(authHooks, 'Object')
        ? authHooks
        : t.isType(authHooks, 'Function')
        ? authHooks(commonHooks, config)
        : {
            before: {
              create: [commonHooks.auth.authenticate(config.strategies)],
              remove: [commonHooks.auth.authenticate('jwt')],
            },
          }
      app.service('authentication').hooks(nextHooks)
    }
)

// INTERFACE:
// namespace: string, to mount api on path
// boxes: array of api boxes from createApiBox({...}) or composeApiBox({...},[...])
// middleware(app){}
// hooks: { before: {...}, after: {...} }
// channels(app){}
export const makeCreateApi = task(t => combineApiBoxes =>
  function({ namespace, boxes, middleware, hooks, authHooks, channels }) {
    // Parse props
    const nextBoxes = t.isType(boxes, 'Object') ? boxes : combineApiBoxes(boxes)

    // Create feathers app with Express engine
    const api = FeathersExpress(Feathers())

    // Load app FeathersConfig
    api.configure(FeathersConfig())

    const logger = createLogger({
      level: t.eq(process.env.NODE_ENV, 'development') ? 'debug' : 'info',
      format: Winston.format.combine(
        Winston.format.splat(),
        Winston.format.simple()
      ),
      transports: [new Winston.transports.Console()],
    })

    api.configure(FeathersLogger(logger))
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
      api.configure(app =>
        configureAuthentication(
          app,
          nextBoxes.lifecycle('authConfig'),
          authHooks
        )
      )
    }

    // Configure boxes
    api.configure(nextBoxes.configure)

    // Configure channels
    api.configure(
      configureChannels(
        t.concat(
          t.isType(channels, 'Function') ? [channels] : [],
          nextBoxes.collection.channels || []
        )
      )
    )

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
    api.use(FeathersExpress.errorHandler({ logger }))

    // Attach global hooks
    if (t.isType(hooks, 'Object')) {
      api.hooks(hooks)
    } else if (t.isType(hooks, 'Function')) {
      api.hooks(hooks(commonHooks))
    }

    // Lifecycle after and onStart
    api.configure(nextBoxes.lifecycle('afterConfig'))
    api.onStart = () => {
      nextBoxes.lifecycle('onStart')(api)
    }

    // yield
    return api
  }
)
