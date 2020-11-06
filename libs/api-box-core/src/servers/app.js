import { task } from '@z1/preset-task'
import {
  FeathersExpress,
  Cors,
  Compression,
} from '@z1/preset-feathers-server-core'
import { Fs } from '@z1/preset-tools'
import Fallback from 'express-history-api-fallback'

// main
export const app = task((t) => (ctx) => {
  const create = (props, cb) => {
    // check for namespace and configure props
    // -> create main app and mount api at namespace
    const namespace = t.atOr('api', 'apiPath', props)
    const appFolderName = t.atOr('site', 'siteFolder', props)
    const configure = t.at('configure', props)
    const api = ctx.api(props)
    const main = FeathersExpress()
    main.use(Cors())
    main.use(Compression())
    main.use(FeathersExpress.json())
    main.use(FeathersExpress.urlencoded({ extended: true }))
    main.use(`/${ctx.safeServiceName(namespace)}`, api)
    if (appFolderName) {
      if (t.isType(appFolderName, 'String')) {
        const root = Fs.path(appFolderName)
        main.use(FeathersExpress.static(root))
        main.use((req, res, next) => {
          // api.log('APP REQUEST -> ', req.originalUrl, namespace)
          if (ctx.pathIncludeNamespace(req.originalUrl, namespace)) {
            next()
          } else {
            Fallback('index.html', { root })(req, res, next)
          }
        })
      }
    }
    if (t.isType(configure, 'Function')) {
      configure(main, api)
    }
    let server = main.listen(api.get('port'), () => {
      if (t.isType(api.onStart, 'Function')) {
        api.onStart()
      }
      if (t.isType(cb, 'Function')) {
        cb(api)
      }
    })
    api.setupComplete = () => {
      api.log('setup complete')
    }
    api.setup(server)
    return {
      namespace,
      main,
      api,
      server,
    }
  }
  return {
    create,
    reload(app, props) {
      app.server.removeListener('request', app.api)
      delete app.api
      const api = ctx.api(props)
      app.server.on('request', api)
      api.setup(app.server)
      app.api = api
      return app
    },
  }
})
