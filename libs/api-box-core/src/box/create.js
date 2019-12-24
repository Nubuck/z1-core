import { task } from '@z1/preset-task'

// main
export const create = task(t => ctx => {
  return ({ models, services, channels, lifecycle }) => {
    return {
      models: t.notType(models, 'Function')
        ? undefined
        : createModel => models(createModel),
      services: t.notType(services, 'Function')
        ? undefined
        : createService => services(createService, ctx.commonHooks),
      channels: t.notType(channels, 'Function')
        ? undefined
        : app => channels(app),
      lifecycle: t.notType(lifecycle, 'Object')
        ? undefined
        : (key, app) => t.pathOr(() => {}, [key], lifecycle || {})(app),
    }
  }
})
