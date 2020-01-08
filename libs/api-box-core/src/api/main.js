import { task } from '@z1/preset-task'
import {
  Feathers,
  FeathersExpress,
  FeathersSocketIO,
  FeathersConfig,
  Cors,
  Compression,
  Winston,
  FeathersLogger,
} from '@z1/preset-feathers-server-core'

// parts
import { adapters } from './adapters'
import { auth } from './auth'
import { channel } from './channel'

// main
export const api = task(t => (ctx = {}) => {
  const Adapters = adapters(ctx)
  const Auth = auth(ctx)
  return function({
    namespace,
    boxes,
    middleware,
    hooks,
    channels,
  }) {
    const nextBoxes = t.isType(boxes, 'Object') ? boxes : ctx.combine(boxes)

    // Create feathers app with Express engine
    const api = FeathersExpress(Feathers())

    // Load app FeathersConfig
    api.configure(FeathersConfig())

    // const logger = Winston.createLogger({
    //   level: t.eq(process.env.NODE_ENV, 'development') ? 'debug' : 'info',
    //   format: Winston.format.combine(
    //     Winston.format.splat(),
    //     Winston.format.simple()
    //   ),
    //   transports: [new Winston.transports.Console()],
    // })
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

    // service tools
    api.set(
      'serviceTools',
      t.pick(['hookSignature', 'hookAndEventSignature', 'safeServiceName'], ctx)
    )

    // adapters
    api.configure(Adapters.configure)

    // Lifecycle before
    api.configure(nextBoxes.lifecycle('beforeConfig'))

    // Configure authentication
    if (api.get('authentication')) {
      api.configure(Auth(nextBoxes.lifecycle('authConfig')))
    }

    // Configure boxes
    // api.configure(nextBoxes.configure)
    const adapterStore = api.get('adapterStore')
    const adapterKeys = t.keys(adapterStore)

    // register models
    t.forEach(modelsFactory => {
      if (t.isType(modelsFactory, 'Function')) {
        modelsFactory(api.get('dbTools').models.create)
      }
    }, nextBoxes.models || [])

    // register services
    t.forEach(servicesFactory => {
      if (t.isType(servicesFactory, 'Function')) {
        servicesFactory(api.get('dbTools').services.create)
      }
    }, nextBoxes.services || [])

    // adapter beforeSetup
    t.forEach(adapterName => {
      t.pathOr(() => {}, [adapterName, 'beforeSetup'], adapterStore)(nextBoxes)
    }, adapterKeys)

    // associate models on setup
    const oldSetup = api.setup
    api.setup = function(...args) {
      const result = oldSetup.apply(this, args)

      // adapter onSetup
      t.forEach(adapterName => {
        t.pathOr(() => {}, [adapterName, 'onSetup'], adapterStore)(nextBoxes)
      }, adapterKeys)

      // lifecycle onSetup
      t.forEach(action => {
        action('onSetup', api)
      }, nextBoxes.lifecycle || [])

      return result
    }

    // adapter afterSetup
    t.forEach(adapterName => {
      t.pathOr(() => {}, [adapterName, 'afterSetup'], adapterStore)(nextBoxes)
    }, adapterKeys)

    // Configure channels
    api.configure(
      channel.config(
        t.concat(
          t.isType(channels, 'Function') ? [channels] : [],
          nextBoxes.channels || []
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
    api.use(FeathersExpress.errorHandler({ logger: Winston }))
    // api.use(FeathersExpress.errorHandler())

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
