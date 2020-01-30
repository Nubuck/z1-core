import { strategy } from './strategy'

// main
export const api = (z, props) =>
  z.featureBox.fn((t, a) =>
    z.featureBox.api.create('machineAccount', [
      {
        models: props.models,
        services(s, h) {
          const dbId = t.eq(props.adapter, 'nedb') ? '_id' : 'id'
          // disable create methods on model services to direct
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
                      t.eq(true, t.atOr(false, 'params.includeLogins', ctx)),
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
            [props.adapter, 'machine-logins'],
            props.serviceFactory.machineLogins,
            {
              hooks: {
                before: {
                  all: [h.auth.authenticate('jwt')],
                  create: [h.common.disallow('external')],
                },
                after: {
                  find: [
                    h.common.when(
                      ctx =>
                        t.eq(true, t.atOr(false, 'params.includeMachine', ctx)),
                      async ctx => {
                        ctx.app.debug('machine login hook params', ctx.params)
                        return ctx
                      }
                    ),
                  ],
                },
              },
            }
          )
          const withStatus = (login, status) => t.merge(login, { status })
          s(
            'machine-account',
            app => {
              return {
                async create({ machine, login }, params) {
                  if (t.or(t.isNil(machine), t.isNil(login))) {
                    throw new z.FeathersErrors.Unprocessable(
                      'Machine account requires both machine and login keys'
                    )
                  }
                  if (
                    t.or(
                      t.isNil(t.atOr(null, 'hashId', machine || {})),
                      t.isNil(t.atOr(null, 'hashId', login || {}))
                    )
                  ) {
                    throw new z.FeathersErrors.Unprocessable(
                      'Machine accounts requires a hashId field for both machine and login'
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
                    const [nextLoginErr, nextLogin] = await a.of(
                      app
                        .service('machine-logins')
                        .create(
                          withStatus(
                            t.merge(login, { machineId: nextMachine[dbId] }),
                            'offline'
                          )
                        )
                    )
                    if (nextLoginErr) {
                      throw new z.FeathersErrors.GeneralError(
                        nextLoginErr.message
                      )
                    }
                    return {
                      machine: nextMachine,
                      login: nextLogin,
                    }
                  }
                  // machine exists
                  const [loginErr, loginResult] = await a.of(
                    app.service('machine-logins').find({
                      query: {
                        hashId: login.hashId,
                      },
                    })
                  )
                  if (loginErr) {
                    throw new z.FeathersErrors.GeneralError(loginErr.message)
                  }
                  const nextMachine = t.head(machineResult.data)
                  // create login
                  if (t.eq(loginResult.total, 0)) {
                    const [nextLoginErr, nextLogin] = await a.of(
                      app
                        .service('machine-logins')
                        .create(
                          withStatus(
                            t.merge(login, { machineId: nextMachine[dbId] }),
                            'offline'
                          )
                        )
                    )
                    if (nextLoginErr) {
                      throw new z.FeathersErrors.GeneralError(
                        nextLoginErr.message
                      )
                    }
                    return {
                      machine: nextMachine,
                      login: nextLogin,
                    }
                  }
                  // login exists
                  const nextLogin = t.head(loginResult.data)
                  return {
                    machine: nextMachine,
                    login: nextLogin,
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
                  //     const logins = await app.service('machine-logins').find({
                  //       query: {
                  //         machineId: payload,
                  //       },
                  //     })
                  //     return {
                  //       machine: t.merge(machine, { logins: logins.data }),
                  //       login: null,
                  //     }
                  //   },
                  //   async login() {
                  //     const login = await app
                  //       .service('machine-logins')
                  //       .get(payload)
                  //     if (t.isNil(login)) {
                  //       throw new z.FeathersErrors.NotFound(
                  //         `No machine-login found for id '${payload}'`
                  //       )
                  //     }
                  //     const machine = await app
                  //       .service('machines')
                  //       .get(login.machineId)
                  //     return {
                  //       machine,
                  //       login,
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
                  //       includelogins: true,
                  //     })
                  //   },
                  //   async login() {
                  //     return await app.service('machine-logins').find({
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
