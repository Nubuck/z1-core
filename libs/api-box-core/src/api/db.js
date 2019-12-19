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
    const getConfig = name => t.pathOr({}, [name], app.get('db'))
    const setAdapter = (name, props) => {
      app.set('dbCtx', t.merge(app.get('dbCtx'), { [name]: props }))
    }
    const getAdapter = name => t.pathOr(null, [name], app.get('dbCtx'))
    const addModel = (adapterName, modelName, model) => {
      const adapter = getAdapter(adapterName)
      if (t.isNil(adapter)) {
        return null
      }
      const models = t.pathOr({}, ['models'], adapter)
      setAdapter(app)(
        name,
        t.merge(adapter, {
          models: t.merge(models, {
            [modelName]: model,
          }),
        })
      )
    }
    app.set('dbTasks', {
      getConfig,
      setAdapter,
      getAdapter,
      addModel,
    })
    app.set('dbCtx', {})
  },
  createModel(name = [], factory = null) {
    return app => {
      const dbTasks = app.get('dbTasks')
      const [adapterName, modelName] = name
      dbTasks.pushModel(adapterName, { [modelName]: factory })
    }
  },
}))
