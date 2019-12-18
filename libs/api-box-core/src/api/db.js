import { task } from '@z1/preset-task'

// notes
/*
interface dbConfig = {
  nedb: string;
  sequelize: object;
  knex: object;
}
*/
// main
export const db = task((t, a) => ({
  init(app) {
    const getConfig = app => name => t.pathOr({}, [name], app.get('db'))
    const setAdapter = app => (name, props) => {
      app.set('dbCtx', t.merge(app.get('dbCtx'), { [name]: props }))
    }
    const getAdapter = app => name => t.pathOr(null, [name], app.get('dbCtx'))
    const pushModel = app => (name, model) => {
      const adapter = getAdapter(app)(name)
      if (t.isNil(adapter)) {
        return null
      }
      const models = t.pathOr([], ['models'], adapter)
      setAdapter(app)(
        name,
        t.merge(adapter, {
          models: t.concat(models, [model]),
        })
      )
    }
    app.set('dbTasks', {
      getConfig: getConfig(app),
      setAdapter: setAdapter(app),
      getAdapter: getAdapter(app),
      pushModel: pushModel(app),
    })
    app.set('dbCtx', {})
  },
  createModel(name = [], factory = null) {
    return app => {
      const dbTasks = app.get('dbTasks')
      const [adapterName, modelName] = name
      dbTasks.pushDbAdapterModel(adapterName, { [modelName]: factory })
    }
  },
}))
