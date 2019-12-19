import { task } from '@z1/preset-task'

// main
export const create = task(t => ctx => {
  return ({ models, services, channels, lifecycle }) => {
    return app => {
      return {
        models: t.notType(models, 'Function')
          ? undefined
          : app.get('dbTasks').makeModels(models),
        services: t.notType(services, 'Function')
          ? undefined
          : app =>
              t.map(service => service(app))(
                services(app.get('createService'), ctx.commonHooks) || []
              ),
        channels: t.notType(channels, 'Function')
          ? undefined
          : app => {
              channels(app)
            },
        lifecycle: t.notType(lifecycle, 'Object')
          ? undefined
          : (key, app) => {
              if (t.isType(t.path([key], lifecycle), 'Function')) {
                t.path([key], lifecycle)(app)
              }
            },
      }
    }
  }
})
