import { task } from '@z1/preset-task'

// main
export const create = task(t => ctx => {
  return app => {
    const dbTasks = app.get('dbTasks')
    return ({ models, services, channels, lifecycle }) => {
      return {
        models(){

        },
        services(){},
        channels(){},
                lifecycle: t.notType(lifecycle, 'Object')
          ? undefined
          : (key, app) => {
              if (t.isType(t.path([key], lifecycle), 'Function')) {
                t.path([key], lifecycle)(app)
              }
      //       },
      }
      // return {
      //   models: t.notType(models, 'Function') ? undefined : makeModels(models),
      //   services: t.notType(services, 'Function')
      //     ? undefined
      //     : (app, models) =>
      //         t.map(service => service(app))(
      //           services(createService, models, commonHooks) || []
      //         ),
      //   channels: t.notType(channels, 'Function')
      //     ? undefined
      //     : app => {
      //         channels(app)
      //       },
      //   lifecycle: t.notType(lifecycle, 'Object')
      //     ? undefined
      //     : (key, app) => {
      //         if (t.isType(t.path([key], lifecycle), 'Function')) {
      //           t.path([key], lifecycle)(app)
      //         }
      //       },
      // }
    }
  }
})
