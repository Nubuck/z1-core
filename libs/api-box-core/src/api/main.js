import { task } from '@z1/preset-task'
import {
  Feathers,
  FeathersExpress,
  FeathersSocketIO,
  FeathersConfig,
  // FeathersAuth,
  // FeathersAuthLocal,
  // FeathersOAuth,
  Cors,
  Compression,
  Winston,
  FeathersLogger,
} from '@z1/preset-feathers-server-core'

// parts
import { db } from './db'
import { services } from './services'

// main
export const api = task(t => (ctx = {}) => {
  return function({
    namespace,
    boxes,
    middleware,
    hooks,
    authHooks,
    channels,
  }) {
    const nextBoxes = t.isType(boxes, 'Object') ? boxes : ctx.box.combine(boxes)

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

    // db init
    db.init(api)

    // services init
    services.init(api)

    // adapters
    t.forEach(adapter => {
      if (t.isType(adapter, 'Function')) {
        adapter(api)
      }
    }, ctx.adapters || [])

    // Lifecycle before
    api.configure(nextBoxes.lifecycle('beforeConfig'))

    // Configure authentication
    if (api.get('authentication')) {
      // api.configure(app =>
      //   configureAuthentication(
      //     app,
      //     nextBoxes.lifecycle('authConfig'),
      //     authHooks
      //   )
      // )
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
})
