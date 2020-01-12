import { task } from '@z1/preset-task'
import { Nedb, FeathersNedb } from '@z1/preset-feathers-server-nedb'
import {
  fs,
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

// models
const createModel = task(t => (name, props = {}) => app => {
  const model = new Nedb(
    t.merge(
      {
        filename: fs.path('nedb', `${name}.db`),
        timestampData: true,
        autoload: true,
      },
      props
    )
  )
  app.set(
    'nedbModels',
    t.merge(app.get('nedbModels') || {}, {
      [name]: model,
    })
  )
  return model
})

// box
const createService = makeCreateService(FeathersNedb)
export const createApiBox = task(t =>
  makeCreateApiBox(
    models => define =>
      t.map(model => model(define))(models(createModel) || []),
    createService
  )
)
export const composeApiBox = makeComposeApiBox(createApiBox)
export const combineApiBoxes = task(t =>
  makeCombineApiBoxes({
    beforeSetup(app, boxes) {
      fs.dir('nedb')
      app.set('nedbModels', {})
      t.forEach(model => {
        if (t.isType(model, 'Function')) {
          model(app)
        }
      }, boxes.models)
    },
    onSetup(app, boxes) {
      boxes.lifecycle('onSync')(app)
    },
    getModels(app) {
      return app.get('nedbModels')
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
