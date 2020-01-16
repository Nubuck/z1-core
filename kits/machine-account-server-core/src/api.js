import { strategy } from './strategy'

// main
export const api = (z, props) =>
  z.featureBox.api.create('machineAccount', [
    {
      models: props.models,
      services(s, h) {
        s([props.adapter, 'machines'], props.serviceFactory.machines, {})
        s(
          [props.adapter, 'machine-users'],
          props.serviceFactory.machineUsers,
          {}
        )
        // s(
        //   [props.adapter, 'machine-account'],
        //   app => {
        //     return null
        //   },
        //   {
        //     hooks: {},
        //     events: {},
        //   }
        // )
      },
      lifecycle: {
        authConfig(app) {
          const { MachineStrategy } = strategy(z)
          app.get('authenticationService').register('machine', new MachineStrategy())
        },
      },
    },
  ])
