import ma from '@z1/kit-machine-account-node'
import { strategy } from './strategy'

// main
export const api = (z, props) => {
  const dbId = z.featureBox.fn(t =>
    t.eq(props.adapter, 'nedb') ? '_id' : 'id'
  )
  const isLogin = z.featureBox.fn(t => user =>
    t.allOf([t.has('login')(user), t.has('machine')(user)])
  )
  const withStatus = z.featureBox.fn(t => (login, status) =>
    t.merge(login, { status })
  )
  const patchStatus = z.featureBox.fn((t, a) => async (app, user, status) => {
    await a.of(app.service('machine-logins').patch(user[dbId], { status }))
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
      app.debug('create machine account failed')
      return null
    }
    const [loginErr, loginResult] = await a.of(
      loginByHashId(app, account.login.hashId)
    )
    if (loginErr) {
      app.set('machineAccount', null)
      app.debug('find machine login failed')
      return null
    }
    if (loginResult.exists) {
      const [machAccErr, machAcc] = await a.of(
        app.service('machine-account').get(loginResult.login[dbId])
      )
      if (machAccErr) {
        app.set('machineAccount', null)
        app.debug('get machine account failed')
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
      app.debug('find machine account failed')
      return null
    }
    if (t.not(machineResult.exists)) {
      app.debug('machine not registered - getting machine account sys info...')
      const [sysErr, machineWithSys] = await a.of(
        ma.machine.system(account.machine)
      )
      if (sysErr) {
        app.set('machineAccount', null)
        app.debug('get machine account sys info failed')
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
        app.debug('create machine account failed')
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
      app.debug('create machine login failed')
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
          const withAlias = type => ctx => {
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
          // adapter services
          s([props.adapter, 'machines'], props.serviceFactory.machines, {
            hooks: {
              before: {
                all: [h.auth.authenticate('jwt')],
                create: [h.common.disallow('external'), withAlias('machine')],
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
                  create: [h.common.disallow('external'), withAlias('login')],
                },
                after: {
                  find: [withMachine],
                  get: [withMachine],
                },
              },
            }
          )
          // meta services
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
                    data: t.map(login => {
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
          [z.featureBox.api.lifecycle.onConfig]: app => {
            const machineConfig = app.get('machine')
            app.set(
              'machine',
              t.merge({ role: 'machine' }, machineConfig || {})
            )
            app.set('registerMachine', configKey =>
              registerMachine(app, configKey)
            )
            app.set('changeMachineStatus', (user, status) =>
              patchStatus(app, user, status)
            )
          },
          [z.featureBox.api.lifecycle.onAuthConfig]: app => {
            const { MachineStrategy } = strategy(
              t.merge(z, { loginByHashId }),
              props.adapter
            )
            app
              .get('authenticationService')
              .register('machine', new MachineStrategy())
          },
          [z.featureBox.api.lifecycle.onSetup]: app => {
            app.on('login', (authResult, params, context) => {
              if (isLogin(t.atOr({}, 'user', authResult))) {
                app
                  .get('changeMachineStatus')(authResult.user, 'online')
                  .then(() => {})
                  .catch(e => app.error('failed to updated machine status', e))
              }
            })
            app.on('logout', (authResult, params, context) => {
              if (isLogin(t.atOr({}, 'user', authResult))) {
                app
                  .get('changeMachineStatus')(authResult.user, 'offline')
                  .then(() => {})
                  .catch(e => app.error('failed to updated machine status', e))
              }
            })
            app.on('disconnect', connection => {
              if (isLogin(t.atOr({}, 'user', connection))) {
                app
                  .get('changeMachineStatus')(connection.user, 'offline')
                  .then(() => {})
                  .catch(e => app.error('failed to updated machine status', e))
              }
            })
          },
          [z.featureBox.api.lifecycle.onSync]: app => {
            app
              .get('registerMachine')('machine')
              .then(() => {
                app.debug('machine registered', app.get('machineAccount')[dbId])
              })
              .catch(e => app.error('register machine err:', e))
          },
          [z.featureBox.api.lifecycle.onStop]: app => {
            app.debug('server stopping, going offline...')
            app
              .get('changeMachineStatus')(app.get('machineAccount'), 'offline')
              .then(() => app.debug('machine status offline'))
              .catch(e => app.error('machine status failed', e))
          },
        },
      },
    ])
  )
}
