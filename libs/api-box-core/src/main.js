import { task } from '@z1/preset-task'

// parts
import { api } from './api'
import { box } from './box'
import { server } from './server'
import { common } from './common'

// main
const configureDb = async app => {
  app.registerDb('nedb', app => {
    return {
      model(name) {},
      service(name, factory, props) {
        const models = app.getModels('nedb')
        const serv = factory(models)
        app.use(name)
      },
    }
  })
  app.registerDb('sequelize', app => {
    return {
      model(name, factory) {},
      service(name, factory, props) {},
    }
  })
  app.registerDb('knex', app => {
    return {
      model(name, factory) {},
      service(name, factory, props) {},
    }
  })
}
export const apiBoxCore = task(t => (ctx = {}) => {
  const dbCtx = {
    nedb: {
      path: '',
      models: {},
    },
    sequelize: {
      client: null,
      lib: null,
      models: {},
    },
    knex: {
      client: null,
      lib: null,
      models: {},
    },
  }
  const macros = {
    models: {
      nedb() {},
      sequelize() {},
      knex() {},
    },
    services: {
      nedb() {},
      sequelize() {},
      knex() {},
    },
  }

  // const nextCtx = t.merge(common, ctx)
  // const Api = api(nextCtx)
  return {
    box: null,
    api: null,
    server: null,
  }
})
