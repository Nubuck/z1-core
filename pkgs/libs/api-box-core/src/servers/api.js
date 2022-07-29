import { task } from '@z1/preset-task'
import { FeathersExpress } from '@z1/preset-feathers-server-core'
import { Fs } from '@z1/preset-tools'
import { createServer } from 'http'
import Fallback from 'express-history-api-fallback'

// main
export const api = task((t) => (ctx) => {
  // TODO: async here
  const create = (props = {}, server = undefined) => {
    try {
      // check props for namespace and site
      const namespace = t.at('apiPath', props)
      const appFolderName = t.at('sitePath', props)
      const middleware = t.at('middleware', props)
      if (
        t.and(t.isType(namespace, 'String'), t.isType(appFolderName, 'String'))
      ) {
        // if found add history fallback api + static
        props = t.merge(props, {
          middleware(app) {
            const root = Fs.path(appFolderName)
            const safeNamespace = `/${ctx.safeServiceName(namespace)}`
            app.use(safeNamespace, FeathersExpress.static(root))
            app.use(safeNamespace, (req, res, next) => {
              if (t.not(ctx.pathIncludeNamespace(req.originalUrl, namespace))) {
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
      // TODO: async here
      const api = ctx.api(props)
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
  return {
    create,
    run(app, cb) {
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
    reload(app, props) {
      app.server.removeListener('request', app.api)
      delete app.api
      const nextApp = create(props, app.server)
      app.server.on('request', nextApp.api)
      nextApp.api.setup(app.server)
      return nextApp
    },
  }
})
