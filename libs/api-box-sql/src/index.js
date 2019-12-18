import { apiBoxCore, fn, fs } from '@z1/lib-api-box-core'
import { Nedb, FeathersNedb } from '@z1/preset-feathers-server-nedb'

// main
export const withNedbAdapter = fn(t => (ctx = {}) => {
  const dbAdapters = t.pathOr([], ['dbAdapters'], ctx)
  const adapter = {
    name: 'nedb',
    beforeSetup(app, boxes) {
      // const config = app.getDbConfig('nedb')
      // fs.dir(config || 'nedb')
      // return {
      //   db:null,
      //   models:[],
      // }
    },
    onSetup(app, boxes) {
      // t.forEach(action => {
      //   action('onSync', app)
      // }, boxes.lifecycle)
    },
    afterSetup(app, boxes) {},
    model(app) {
      return (name, props = {}) => {

      }
    },
    service(app) {},
  }
  return t.merge(ctx, {
    dbAdapters: t.concat(dbAdapters, [adapter]),
  })
})
