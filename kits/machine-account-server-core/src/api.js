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
              after: {
                find: [
                  h.common.when(
                    ctx =>
                      t.eq(true, t.atOr(false, 'params.includeUsers', ctx)),
                    async ctx => {
                      ctx.app.debug('machines hook params', ctx.params)
                      return ctx
                    }
                  ),
                ],
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
                after: {
                  find: [
                    async ctx => {
                      ctx.app.debug('machine users hook params', ctx.params)
                      return ctx
                    },
                  ],
                },
              },
            }
          )
          const withStatus = (user, status) => t.merge(user, { status })
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
                      t.isNil(t.atOr(null, 'hashId', machine || {})),
                      t.isNil(t.atOr(null, 'hashId', user || {}))
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
                    throw new z.FeathersErrors.GeneralError(machineErr.message)
                  }
                  // create machine
                  if (t.eq(machineResult.total, 0)) {
                    const [nextMachineErr, nextMachine] = await a.of(
                      app.service('machines').create(machine)
                    )
                    if (nextMachineErr) {
                      throw new z.FeathersErrors.GeneralError(
                        nextMachineErr.message
                      )
                    }
                    const [nextUserErr, nextUser] = await a.of(
                      app
                        .service('machine-users')
                        .create(
                          withStatus(
                            t.merge(user, { machineId: nextMachine._id }),
                            'offline'
                          )
                        )
                    )
                    if (nextUserErr) {
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
                    throw new z.FeathersErrors.GeneralError(userErr.message)
                  }
                  const nextMachine = t.head(machineResult.data)
                  // create user
                  if (t.eq(userResult.total, 0)) {
                    const [nextUserErr, nextUser] = await a.of(
                      app
                        .service('machine-users')
                        .create(
                          withStatus(
                            t.merge(user, { machineId: nextMachine._id }),
                            'offline'
                          )
                        )
                    )
                    if (nextUserErr) {
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
                async get(id) {
                  return { id }
                  // const type = t.at('type', id)
                  // const payload = t.at('payload', id)
                  // if (t.or(t.isNil(type), t.isNil(payload))) {
                  //   throw new z.FeathersErrors.Unprocessable(
                  //     'Machine account get requires a type and payload in the id'
                  //   )
                  // }
                  // return await t.match({
                  //   async machine() {
                  //     const machine = await app.service('machines').get(payload)
                  //     if (t.isNil(machine)) {
                  //       throw new z.FeathersErrors.NotFound(
                  //         `No machine found for id '${payload}'`
                  //       )
                  //     }
                  //     const users = await app.service('machine-users').find({
                  //       query: {
                  //         machineId: payload,
                  //       },
                  //     })
                  //     return {
                  //       machine: t.merge(machine, { users: users.data }),
                  //       user: null,
                  //     }
                  //   },
                  //   async user() {
                  //     const user = await app
                  //       .service('machine-users')
                  //       .get(payload)
                  //     if (t.isNil(user)) {
                  //       throw new z.FeathersErrors.NotFound(
                  //         `No machine-user found for id '${payload}'`
                  //       )
                  //     }
                  //     const machine = await app
                  //       .service('machines')
                  //       .get(user.machineId)
                  //     return {
                  //       machine,
                  //       user,
                  //     }
                  //   },
                  //   _: async () => null,
                  // })(t.to.lowerCase(type))()
                },
                async find(params) {
                  return []
                  // const type = t.at('query.type', params)
                  // if (t.isNil(type)) {
                  //   throw new z.FeathersErrors.Unprocessable(
                  //     'Machine account find requires a type in the query'
                  //   )
                  // }
                  // return await t.match({
                  //   async machine() {
                  //     return await app.service('machines').find({
                  //       query: t.omit(['type'], params.query),
                  //       includeUsers: true,
                  //     })
                  //   },
                  //   async user() {
                  //     return await app.service('machine-users').find({
                  //       query: t.omit(['type'], params.query),
                  //       includeMachine: true,
                  //     })
                  //   },
                  //   _: async () => null,
                  // })(t.to.lowerCase(type))()
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
          [z.featureBox.api.lifecycle.onAuthConfig]: app => {
            const { MachineStrategy } = strategy(z)
            app
              .get('authenticationService')
              .register('machine', new MachineStrategy())
          },
          // [z.featureBox.api.lifecycle.onSetup]: app => {
          //   app.on('login', (authResult, params, context) => {
          //     app.debug(
          //       'MACHINE LOGIN',
          //       authResult,
          //       t.keys(params),
          //       t.keys(context)
          //     )
          //   })
          //   app.on('logout', (authResult, params, context) => {
          //     app.debug(
          //       'MACHINE LOGOUT',
          //       authResult,
          //       t.keys(params),
          //       t.keys(context)
          //     )
          //   })
          //   app.on('disconnect', connection => {
          //     app.debug('MACHINE DISCONNECT', t.keys(connection))
          //   })
          // },
        },
      },
    ])
  )
