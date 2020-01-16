import { strategy } from './strategy'

// main
export const api = (z, props) =>
  z.featureBox.fn((t, a) =>
    z.featureBox.api.create('machineAccount', [
      {
        models: props.models,
        services(s, h) {
          s([props.adapter, 'machines'], props.serviceFactory.machines, {
            hooks: {
              before: {
                all: [h.common.disallow('external')],
              },
            },
          })
          s(
            [props.adapter, 'machine-users'],
            props.serviceFactory.machineUsers,
            {
              hooks: {
                before: {
                  all: [h.common.disallow('external')],
                },
              },
            }
          )
          s(
            ['machine-account'],
            app => {
              return {
                async get(id, params) {
                  console.log('MACHINE ACCOUNT GET', id)
                  return null
                },
                async find(params) {
                  console.log('MACHINE ACCOUNT GET', find)
                  // params: { query }
                  return null
                },
                async create(data, params) {
                  console.log('MACHINE ACCOUNT CREATE', data)
                  // data: { machine, user }
                  return null
                },
                async patch(id, data, params) {
                  console.log('MACHINE ACCOUNT PATCH', id, data)
                  // data: { machine, user, action }
                  return null
                },
              }
            },
            {
              hooks: {},
              events: {},
            }
          )
        },
        lifecycle: {
          authConfig(app) {
            const { MachineStrategy } = strategy(z)
            app
              .get('authenticationService')
              .register('machine', new MachineStrategy())
          },
        },
      },
    ])
  )
