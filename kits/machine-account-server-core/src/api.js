import ma from '@z1/kit-machine-account-node'
import { strategy } from './strategy'

// main
export const api = (z, props) => {
  const dbId = '_id'
  const isLogin = z.featureBox.fn(
    (t) => (user) => t.allOf([t.has('login')(user), t.has('machine')(user)])
  )
  const withStatus = z.featureBox.fn(
    (t) => (login, status) => t.merge(login, { status })
  )
  const patchStatus = z.featureBox.fn((t, a) => async (app, user, status) => {
    const [_, login] = await a.of(
      app.service('machine-logins').patch(user[dbId], { status })
    )
    const machineId = t.at('machineId', login || {})
    if (t.notNil(machineId)) {
      const [__, machine] = await a.of(app.service('machines').get(machineId))
      if (t.notNil(machine)) {
        const logins = t.atOr([], 'logins', machine || {})
        const status = t.noLen(logins)
          ? 'offline'
          : t.anyOf(t.map((login) => t.eq('online', login.status), logins))
          ? t.anyOf([
              t.isNil(machine.status),
              t.includes(machine.status || '__', ['offline', 'init']),
            ])
            ? 'online'
            : machine.status
          : 'offline'
        if (t.neq(status, machine.status)) {
          await a.of(app.service('machines').patch(machineId, { status }))
        }
      }
    }
    return null
  })
  const machineByHashId = z.featureBox.fn((t, a) => async (app, hashId) => {
    const [machineErr, machineResult] = await a.of(
      app.service('machines').find(
        {
          query: {
            hashId,
          },
        },
        { excludeLogins: true }
      )
    )
    if (machineErr) {
      throw new z.FeathersErrors.GeneralError(machineErr.message)
    }
    return {
      exists: t.gt(machineResult.total, 0),
      machine: t.head(machineResult.data),
    }
  })
  const loginByHashId = z.featureBox.fn((t, a) => async (app, hashId) => {
    const [loginErr, loginResult] = await a.of(
      app.service('machine-logins').find({
        query: {
          hashId,
        },
      })
    )
    if (loginErr) {
      throw new z.FeathersErrors.GeneralError(loginErr.message)
    }
    return {
      exists: t.gt(loginResult.total, 0),
      login: t.head(loginResult.data),
    }
  })
  const registerMachine = z.featureBox.fn((t, a) => async (app, configKey) => {
    const [accountErr, account] = await a.of(
      ma.machine.account({
        role: t.atOr('machine', 'role', app.get(configKey)),
      })
    )
    if (accountErr) {
      app.set('machineAccount', null)
      app.error('create machine account failed', accountErr)
      return null
    }
    const [loginErr, loginResult] = await a.of(
      loginByHashId(app, account.login.hashId)
    )
    if (loginErr) {
      app.set('machineAccount', null)
      app.error('find machine login failed', loginErr)
      return null
    }
    if (loginResult.exists) {
      const [machAccErr, machAcc] = await a.of(
        app.service('machine-account').get(loginResult.login[dbId])
      )
      if (machAccErr) {
        app.set('machineAccount', null)
        app.error('get machine account failed', machAccErr)
        return null
      }
      await patchStatus(app, loginResult.login, 'online')
      app.set('machineAccount', machAcc)
      return null
    }
    // login doesnt exist
    const [machErr, machineResult] = await a.of(
      machineByHashId(app, account.machine.hashId)
    )
    if (machErr) {
      app.set('machineAccount', null)
      app.error('find machine account failed', machErr)
      return null
    }
    if (t.not(machineResult.exists)) {
      app.debug('machine not registered - getting machine account sys info...')
      const [sysErr, machineWithSys] = await a.of(
        ma.machine.system(account.machine)
      )
      if (sysErr) {
        app.set('machineAccount', null)
        app.error('get machine account sys info failed', sysErr)
        return null
      }
      const [machAccErr, machAcc] = await a.of(
        app.service('machine-account').create({
          login: account.login,
          machine: machineWithSys,
        })
      )
      if (machAccErr) {
        app.set('machineAccount', null)
        app.error('create machine account failed', machAccErr)
        return null
      }
      await patchStatus(app, machAcc.login, 'online')
      app.set('machineAccount', machAcc)
      return null
    }
    // machine exists but login doesnt
    const [nextLoginErr, nextLogin] = await a.of(
      app
        .service('machine-logins')
        .create(
          withStatus(
            t.merge(account.login, { machineId: machineResult.machine[dbId] }),
            'online'
          )
        )
    )
    if (nextLoginErr) {
      app.set('machineAccount', null)
      app.error('create machine login failed', nextLoginErr)
      return null
    }
    await patchStatus(app, nextLogin, 'online')
    app.set('machineAccount', {
      [dbId]: nextLogin[dbId],
      role: nextLogin.role,
      machine: machineResult.machine,
      login: nextLogin,
    })
    return null
  })
  return z.featureBox.fn((t, a) =>
    z.featureBox.api.create('machineAccount', [
      {
        models: props.models,
        services(s, h) {
          const withAlias = (type) => (ctx) => {
            ctx.data = t.runMatch({
              _: () => ctx.data,
              machine: () =>
                t.merge(ctx.data, {
                  alias: t.tags.oneLineTrim`
                  ${ctx.data.manufacturer}/
                  ${ctx.data.model}/
                  ${ctx.data.serialnumber}`,
                }),
              login: () =>
                t.merge(ctx.data, {
                  alias: t.to.lowerCase(t.tags.oneLineTrim`
                  ${ctx.data.hostname}/
                  ${ctx.data.username}`),
                }),
            })(type)
            return ctx
          }
          const withQueryParams = (ctx) => {
            const excludeLogins = t.at('params.query.excludeLogins', ctx)
            const includeMachine = t.at('params.query.includeMachine', ctx)
            if (t.and(t.isNil(excludeLogins), t.isNil(includeMachine))) {
              return ctx
            }
            ctx.params.query = t.omit(
              ['excludeLogins', 'includeMachine'],
              ctx.params.query
            )
            if (t.notNil(excludeLogins)) {
              ctx.params.excludeLogins = excludeLogins
            }
            if (t.notNil(includeMachine)) {
              ctx.params.includeMachine = includeMachine
            }
            return ctx
          }
          const withLogins = h.common.when(
            (ctx) => {
              return t.not(t.atOr(false, 'params.excludeLogins', ctx))
            },
            h.common.fastJoin((ctx) => {
              return {
                joins: {
                  logins() {
                    return async (machine) => {
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
            (ctx) => t.eq(true, t.atOr(false, 'params.includeMachine', ctx)),
            h.common.fastJoin((ctx) => {
              return {
                joins: {
                  machine() {
                    return async (login) => {
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
          // adapter services
          const machineHooks = t.atOr(() => ({}), 'machineHooks', props)
          const mk = machineHooks(h)
          s([props.adapter, 'machines'], props.serviceFactory.machines, {
            hooks: {
              before: {
                all: [h.auth.authenticate('jwt')],
                get: [withQueryParams],
                find: [withQueryParams],
                create: [
                  h.common.disallow('external'),
                  h.common.when(
                    t.neq('nedb', props.adapter),
                    h.data.withIdUUIDV4
                  ),
                  withAlias('machine'),
                  withQueryParams,
                  h.common.setNow('createdAt', 'updatedAt'),
                ],
                patch: [withQueryParams, h.common.setNow('updatedAt')],
              },
              after: {
                get: t.flatten([withLogins, t.atOr([], 'after.get', mk)]),
                find: t.flatten([withLogins, t.atOr([], 'after.find', mk)]),
                patch: t.flatten([withLogins, t.atOr([], 'after.patch', mk)]),
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
                  get: [withQueryParams],
                  find: [withQueryParams],
                  create: [
                    h.common.disallow('external'),
                    h.common.when(
                      t.neq('nedb', props.adapter),
                      h.data.withIdUUIDV4
                    ),
                    withAlias('login'),
                    withQueryParams,
                    h.common.setNow('createdAt', 'updatedAt'),
                  ],
                  patch: [withQueryParams, h.common.setNow('updatedAt')],
                },
                after: {
                  get: [withMachine],
                  find: [withMachine],
                  get: [withMachine],
                  patch: [withMachine],
                },
              },
            }
          )
          // meta services
          s(
            'machine-account',
            (app) => {
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
                  const machineResult = await machineByHashId(
                    app,
                    machine.hashId
                  )
                  if (t.not(machineResult.exists)) {
                    const [nextMachineErr, nextMachine] = await a.of(
                      app.service('machines').create(machine)
                    )
                    if (nextMachineErr) {
                      throw new z.FeathersErrors.GeneralError(
                        nextMachineErr.message
                      )
                    }
                    const [nextLoginErr, nextLogin] = await a.of(
                      app.service('machine-logins').create(
                        withStatus(
                          t.merge(login, {
                            machineId: nextMachine[dbId],
                          }),
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
                      role: nextLogin.role,
                      machine: nextMachine,
                      login: nextLogin,
                    }
                  }
                  // machine exists
                  const loginResult = await loginByHashId(app, login.hashId)
                  if (loginResult.exists) {
                    return {
                      [dbId]: loginResult.login[dbId],
                      role: loginResult.login.role,
                      machine: machineResult.machine,
                      login: loginResult.login,
                    }
                  } else {
                    // login doesnt exist
                    const [nextLoginErr, nextLogin] = await a.of(
                      app.service('machine-logins').create(
                        withStatus(
                          t.merge(login, {
                            machineId: machineResult.machine[dbId],
                          }),
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
                      role: nextLogin.role,
                      machine: machineResult.machine,
                      login: nextLogin,
                    }
                  }
                },
                async get(id) {
                  const login = await app
                    .service('machine-logins')
                    .get(id, { includeMachine: true })
                  return {
                    [dbId]: login[dbId],
                    role: login.role,
                    login: t.omit(['machine'], login),
                    machine: t.at('machine', login),
                  }
                },
                async find(params) {
                  const logins = await app
                    .service('machine-logins')
                    .find(params, { includeMachine: true })
                  return t.merge(logins, {
                    data: t.map((login) => {
                      return {
                        [dbId]: login[dbId],
                        role: login.role,
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
          [z.featureBox.api.lifecycle.onConfig]: (app) => {
            const machineConfig = app.get('machine')
            app.set(
              'machine',
              t.merge({ role: 'machine' }, machineConfig || {})
            )
            app.set('registerMachine', (configKey) =>
              registerMachine(app, configKey)
            )
            app.set('changeMachineStatus', (user, status) =>
              patchStatus(app, user, status)
            )
          },
          [z.featureBox.api.lifecycle.onAuthConfig]: (app) => {
            const { MachineStrategy } = strategy(
              t.merge(z, { loginByHashId }),
              props.adapter
            )
            app
              .get('authenticationService')
              .register('machine', new MachineStrategy())
          },
          [z.featureBox.api.lifecycle.onSetup]: (app) => {
            app.on('login', (authResult, params, context) => {
              if (isLogin(t.atOr({}, 'user', authResult))) {
                app
                  .get('changeMachineStatus')(authResult.user, 'online')
                  .then(() => {})
                  .catch((e) =>
                    app.error('failed to updated machine status', e)
                  )
              }
            })
            app.prependListener('logout', (authResult, params, context) => {
              if (isLogin(t.atOr({}, 'user', authResult))) {
                app
                  .get('changeMachineStatus')(authResult.user, 'offline')
                  .then(() => {})
                  .catch((e) =>
                    app.error('failed to updated machine status', e)
                  )
              }
            })
            app.prependListener('disconnect', (connection) => {
              if (isLogin(t.atOr({}, 'user', connection))) {
                app
                  .get('changeMachineStatus')(connection.user, 'offline')
                  .then(() => {})
                  .catch((e) =>
                    app.error('failed to updated machine status', e)
                  )
              }
            })
          },
          [z.featureBox.api.lifecycle.onSync]: (app) => {
            app
              .get('registerMachine')('machine')
              .then(() => {
                if (t.notNil(app.get('machineAccount'))) {
                  app.debug('machine registered')
                } else {
                  app.debug('machine register failed')
                }
              })
              .catch((e) => app.error('register machine err:', e))
          },
          [z.featureBox.api.lifecycle.onStop]: (app) => {
            app.debug('server stopping, going offline...')
            const destroy = () => {
              const db = app.get('knex')
              if (t.notNil(db)) {
                const client = t.at('client', db)
                if (t.notNil(client)) {
                  client.destroy()
                }
              }
            }
            app
              .get('changeMachineStatus')(app.get('machineAccount'), 'offline')
              .then(() => {
                app.debug('machine status offline')
                destroy()
              })
              .catch((e) => {
                app.error('machine status failed', e)
                destroy()
              })
          },
        },
      },
    ])
  )
}
