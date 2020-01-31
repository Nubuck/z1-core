import { strategy } from './strategy'

// main
export const api = (z, props) => {
  const dbId = z.featureBox.fn(t =>
    t.eq(props.adapter, 'nedb') ? '_id' : 'id'
  )
  const isLogin = z.featureBox.fn(t => user =>
    t.allOf([t.has('login')(user), t.has('machine')(user)])
  )
  const patchStatus = z.featureBox.fn((t, a) => async (app, user, status) => {
    await a.of(app.service('machine-logins').patch(user[dbId], { status }))
  })
  return z.featureBox.fn((t, a) =>
    z.featureBox.api.create('machineAccount', [
      {
        models: props.models,
        services(s, h) {
          const withLogins = h.common.when(
            ctx => {
              return t.not(t.atOr(false, 'params.excludeLogins', ctx))
            },
            h.common.fastJoin(ctx => {
              return {
                joins: {
                  logins() {
                    return async machine => {
                      const result = await ctx.app
                        .service('machine-logins')
                        .find({
                          query: {
                            machineId: machine[dbId],
                            $limit: 10000,
                          },
                        })
                      machine.logins = result.data
                      return machine
                    }
                  },
                },
              }
            })
          )
          const withMachine = h.common.when(
            ctx => t.eq(true, t.atOr(false, 'params.includeMachine', ctx)),
            h.common.fastJoin(ctx => {
              return {
                joins: {
                  machine() {
                    return async login => {
                      const result = await ctx.app
                        .service('machines')
                        .get(login.machineId, { excludeLogins: true })
                      login.machine = result
                      return login
                    }
                  },
                },
              }
            })
          )
          const withStatus = (login, status) => t.merge(login, { status })

          s([props.adapter, 'machines'], props.serviceFactory.machines, {
            hooks: {
              before: {
                all: [h.auth.authenticate('jwt')],
                // create: [h.common.disallow('external')],
              },
              after: {
                find: [withLogins],
                get: [withLogins],
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
                  // create: [h.common.disallow('external')],
                },
                after: {
                  find: [withMachine],
                  get: [withMachine],
                },
              },
            }
          )

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
                    app.service('machines').find(
                      {
                        query: {
                          hashId: machine.hashId,
                        },
                      },
                      { excludeLogins: true }
                    )
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
                      [dbId]: nextLogin[dbId],
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
                      [dbId]: nextLogin[dbId],
                      machine: nextMachine,
                      login: nextLogin,
                    }
                  }
                  // login exists
                  const nextLogin = t.head(loginResult.data)
                  return {
                    [dbId]: nextLogin[dbId],
                    machine: nextMachine,
                    login: nextLogin,
                  }
                },
                async get(id) {
                  const login = await app
                    .service('machine-logins')
                    .get(id, { includeMachine: true })
                  return {
                    [dbId]: login[dbId],
                    login: t.omit(['machine'], login),
                    machine: t.at('machine', login),
                  }
                },
                async find(params) {
                  const logins = await app
                    .service('machine-logins')
                    .find(params, { includeMachine: true })

                  return t.merge(logins, {
                    data: t.map(login => {
                      return {
                        [dbId]: login[dbId],
                        login: t.omit(['machine'], login),
                        machine: t.at('machine', login),
                      }
                    }, logins.data || []),
                  })
                },
              }
            },
            {
              hooks: {
                before: {
                  get: [h.auth.authenticate('jwt')],
                  find: [h.auth.authenticate('jwt')],
                },
              },
              events: {},
            }
          )
        },
        lifecycle: {
          [z.featureBox.api.lifecycle.onAuthConfig]: app => {
            const { MachineStrategy } = strategy(z, props.adapter)
            app
              .get('authenticationService')
              .register('machine', new MachineStrategy())
          },
          [z.featureBox.api.lifecycle.onSetup]: app => {
            app.on('login', (authResult, params, context) => {
              if (isLogin(authResult.user)) {
                patchStatus(app, authResult.user, 'online')
                .then(()=>{})
                  .catch(e => app.error('failed to updated machine status', e))
              }
            })
            app.on('logout', (authResult, params, context) => {
              if (isLogin(authResult.user)) {
                patchStatus(app, authResult.user, 'offline')
                .then(()=>{})
                  .catch(e => app.error('failed to updated machine status', e))
              }
            })
            app.on('disconnect', connection => {
              if (isLogin(connection.user)) {
                patchStatus(app, connection.user, 'offline')
                .then(()=>{})
                  .catch(e => app.error('failed to updated machine status', e))
              }
            })
          },
        },
      },
    ])
  )
}
