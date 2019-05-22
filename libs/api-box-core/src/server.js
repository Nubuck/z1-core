import { task } from '@z1/preset-task'
import { FeathersExpress, Cors, Compression } from '@z1/preset-feathers-server'
import { Fs } from '@z1/preset-tools'
import { createServer } from 'http'
import Fallback from 'express-history-api-fallback'

// parts
import { pathIncludeNamespace, safeServiceName } from './common'
import { createApi } from './api'

// main
export const createApiServer = task(
  t =>
    function(props = {}, server = undefined) {
      try {
        // check props for namespace and site
        const namespace = t.path(['namespace'], props)
        const appFolderName = t.path(['appFolderName'], props)
        const middleware = t.path(['middleware'], props)
        if (
          t.and(
            t.isType(namespace, 'String'),
            t.isType(appFolderName, 'String')
          )
        ) {
          // if found add history fallback api + static
          props = t.merge(props, {
            middleware(app) {
              const root = Fs.path(appFolderName)
              const safeNamespace = `/${safeServiceName(namespace)}`
              app.use(safeNamespace, FeathersExpress.static(root))
              app.use(safeNamespace, (req, res, next) => {
                // app.log('APP REQUEST -> ', req.originalUrl, namespace)
                if (t.not(pathIncludeNamespace(req.originalUrl, namespace))) {
                  next()
                } else {
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
          main: t.not(server) ? createServer(api) : null,
          api,
          server,
        }
      } catch (e) {
        console.log('ERROR BOOTING APP', e)
        throw e
      }
    }
)

export const runServer = task(t => (app, cb) => {
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
})

export const reloadServer = function(app, props) {
  app.server.removeListener('request', app.api)
  delete app.api
  const nextApp = createApiServer(props, app.server)
  app.server.on('request', nextApp.api)
  nextApp.api.setup(app.server)
  return nextApp
}

// app server
export const createAppServer = task(t => (props, cb) => {
  // check for namespace and configure props
  // -> create main app and mount api at namespace
  const namespace = t.path(['namespace'], props)
  const appFolderName = t.path(['appFolderName'], props)
  const configure = t.path(['configure'], props)
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
        } else {
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
})

export const reloadAppServer = task(t => (app, props) => {
  app.server.removeListener('request', app.api)
  delete app.api
  const api = createApi(props)
  app.server.on('request', api)
  api.setup(app.server)
  app.api = api
  return app
})
