import { strategy } from './strategy'

// main
export const api = (z, props) =>
  z.featureBox.fn((t, a) =>
    z.featureBox.api.create('machineAccount', [
      {
        models: props.models,
        services(s, h) {
          // disbale create methods on model services to direct
          // through machine-account service
          s([props.adapter, 'machines'], props.serviceFactory.machines, {
            hooks: {
              before: {
                all: [h.auth.authenticate('jwt')],
                create: [h.common.disallow('external')],
              },
            },
          })
          s(
            [props.adapter, 'machine-users'],
            props.serviceFactory.machineUsers,
            {
              hooks: {
                before: {
                  all: [h.auth.authenticate('jwt')],
                  create: [h.common.disallow('external')],
                },
              },
            }
          )
          const withOffline = user => t.merge(user, { status: 'offline' })
          s(
            'machine-account',
            app => {
              return {
                async create({ machine, user }, params) {
                  if (t.or(t.isNil(machine), t.isNil(user))) {
                    throw new z.FeathersErrors.Unprocessable(
                      'Machine account requires both machine and user keys'
                    )
                  }
                  if (
                    t.or(
                      t.isNil(t.pathOr(null, ['hashId'], machine || {})),
                      t.isNil(t.pathOr(null, ['hashId'], user || {}))
                    )
                  ) {
                    throw new z.FeathersErrors.Unprocessable(
                      'Machine accounts requires a hashId field for both machine and user'
                    )
                  }
                  const [machineErr, machineResult] = await a.of(
                    app.service('machines').find({
                      query: {
                        hashId: machine.hashId,
                      },
                    })
                  )
                  if (machineErr) {
                    console.log('machine err', machine, machineErr)
                    throw new z.FeathersErrors.GeneralError(machineErr.message)
                  }
                  // create machine
                  if (t.eq(machineResult.total, 0)) {
                    const [nextMachineErr, nextMachine] = await a.of(
                      app.service('machines').create(machine)
                    )
                    if (nextMachineErr) {
                      console.log('next machine err', nextMachine, machineErr)
                      throw new z.FeathersErrors.GeneralError(
                        nextMachineErr.message
                      )
                    }
                    const [nextUserErr, nextUser] = await a.of(
                      app
                        .service('machine-users')
                        .create(
                          withOffline(
                            t.merge(user, { machineId: nextMachine._id })
                          )
                        )
                    )
                    if (nextUserErr) {
                      console.log('next user err', nextUser, nextUserErr)
                      throw new z.FeathersErrors.GeneralError(
                        nextUserErr.message
                      )
                    }
                    return {
                      machine: nextMachine,
                      user: nextUser,
                    }
                  }
                  // machine exists
                  const [userErr, userResult] = await a.of(
                    app.service('machine-users').find({
                      query: {
                        hashId: user.hashId,
                      },
                    })
                  )
                  if (userErr) {
                    console.log('user err', userResult, userErr)
                    throw new z.FeathersErrors.GeneralError(userErr.message)
                  }
                  const nextMachine = t.head(machineResult.data)
                  // create user
                  if (t.eq(userResult.total, 0)) {
                    const [nextUserErr, nextUser] = await a.of(
                      app
                        .service('machine-users')
                        .create(
                          withOffline(
                            t.merge(user, { machineId: nextMachine._id })
                          )
                        )
                    )
                    if (nextUserErr) {
                      console.log('next user 2 err', nextUser, nextUserErr)
                      throw new z.FeathersErrors.GeneralError(
                        nextUserErr.message
                      )
                    }
                    return {
                      machine: nextMachine,
                      user: nextUser,
                    }
                  }
                  // user exists
                  const nextUser = t.head(userResult.data)
                  return {
                    machine: nextMachine,
                    user: nextUser,
                  }
                },
                // async get(id, params) {
                //   console.log('MACHINE ACCOUNT GET', id)
                //   return null
                // },
                // async find(params) {
                //   console.log('MACHINE ACCOUNT GET', find)
                //   // params: { query }
                //   return null
                // },
                // async patch(id, data, params) {
                //   console.log('MACHINE ACCOUNT PATCH', id, data)
                //   // data: { machine, user, action }
                //   return null
                // },
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
