// main
export const api = ctx =>
  ctx.apiBox.create('machineAccount', [
    {
      models: ctx.models,
      services(s, h) {
        s([ctx.adapter, 'machines'], ctx.serviceFactory.machines, {
          hooks: {},
          events: {},
        })
        s([ctx.adapter, 'machine-users'], ctx.serviceFactory.machineUsers, {
          hooks: {},
          events: {},
        })
        s(
          [ctx.adapter, 'machine-account'],
          app => {
            return null
          },
          {
            hooks: {},
            events: {},
          }
        )
      },
      lifecycle: {
        authConfig(app) {},
      },
    },
  ])
