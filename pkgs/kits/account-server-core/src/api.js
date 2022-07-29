import AuthManagement from 'feathers-authentication-management'

// main
export const api = (z, props) => {
  const dbId = '_id'
  const isAction = z.featureBox.fn((t) => (actions = []) => (hook) => {
    return t.notNil(t.find((action) => t.eq(action, hook.data.action), actions))
  })
  const isUser = z.featureBox.fn(
    (t) => (user) =>
      t.allOf([
        t.has('name')(user),
        t.has('surname')(user),
        t.has('email')(user),
      ])
  )
  const patchStatus = z.featureBox.fn((t, a) => async (app, user, status) => {
    await a.of(app.service('users').patch(user[dbId], { status }))
  })
  const bootAccountStatus = z.featureBox.fn((t, a) => async (app) => {
    const status = t.atOr('open', 'status', app.get('management'))
    // boot users
    const [userErr, users] = await a.of(app.service('users').find())
    if (userErr) {
      app.error('Error setting up access', userErr)
    }
    const hasUsers = t.gt(users.total, 0)
    const bootStatus = hasUsers ? status : 'init'
    app.set('account-status', bootStatus)
    if (t.not(hasUsers)) {
      let handle = null
      const setStatus = () => {
        app.set('account-status', status)
        app.service('users').off('created', handle)
      }
      handle = setStatus
      app.service('users').on('created', handle)
    }
  })

  const bootAccountVerification = z.featureBox.fn((t, a) => async (app) => {
    const verification = t.atOr(
      false,
      'forceVerification',
      app.get('authentication')
    )
    app.set('verification', verification)
  })

  return z.featureBox.fn((t, a) =>
    z.featureBox.api.create('account', {
      models: props.models,
      services(s, h) {
        const userKeys = ['verifyChanges']
        s([props.adapter, 'users'], props.serviceFactory, {
          hooks: {
            before: {
              find: [h.auth.authenticate('jwt'), h.data.safeFindMSSQL],
              get: [h.auth.authenticate('jwt')],
              create: [
                h.common.when(
                  t.neq('nedb', props.adapter),
                  h.data.withIdUUIDV4
                ),
                h.auth.hashPassword('password'),
                (hook) => {
                  const email = t.at('data.email', hook)
                  if (t.notNil(email)) {
                    hook.data.email = t.to.lowerCase(email)
                  }
                  return hook
                },
                AuthManagement.hooks.addVerification('auth-management'),
                (ctx) => {
                  if (t.eq('init', ctx.app.get('account-status'))) {
                    ctx.data.role = 'admin'
                  }
                  ctx.data.verifyChanges = JSON.stringify(
                    t.atOr({}, 'data.verifyChanges', ctx)
                  )
                  if (t.notNil(ctx.data.verifyExpires)) {
                    ctx.data.verifyExpires = new Date(ctx.data.verifyExpires)
                  }
                  return ctx
                },
                h.common.setNow('createdAt', 'updatedAt'),
              ],
              update: [
                h.common.disallow('external'),
                h.common.setNow('updatedAt'),
                h.data.withSafeStringify(userKeys),
                (hook) => {
                  const email = t.at('data.email', hook)
                  if (t.notNil(email)) {
                    hook.data.email = t.to.lowerCase(email)
                  }
                  return hook
                },
              ],
              patch: [
                h.common.when(
                  h.common.isProvider('external'),
                  h.auth.hashPassword('password'),
                  h.auth.authenticate('jwt')
                ),
                h.common.setNow('updatedAt'),
                h.data.withSafeStringify(userKeys),
                (hook) => {
                  const email = t.at('data.email', hook)
                  if (t.notNil(email)) {
                    hook.data.email = t.to.lowerCase(email)
                  }
                  return hook
                },
              ],
              remove: [h.auth.authenticate('jwt')],
            },
            after: {
              all: [h.auth.protect('password')],
              get: [h.data.withSafeParse(userKeys)],
              find: [h.data.withSafeParse(userKeys)],
              create: [
                h.data.withSafeParse(userKeys),
                (hook) => {
                  if (!hook.params.provider) {
                    return hook
                  }
                  if (t.eq('active', hook.app.get('communication'))) {
                    const user = hook.result
                    if (hook.data && hook.data.email && user) {
                      z.communicate(hook.app, user)['resendVerifySignup']()
                      return hook
                    }
                  }
                  return hook
                },
                AuthManagement.hooks.removeVerification(),
              ],
              patch: [h.data.withSafeParse(userKeys)],
              update: [h.data.withSafeParse(userKeys)],
            },
          },
        })
        s(
          'auth-management',
          (app) => {
            const service = AuthManagement({
              service: '/users',
              path: 'auth-management',
              identifyUserProps: ['email'],
              notifier(type, user) {
                if (t.eq('active', app.get('communication'))) {
                  const actions = z.communicate(app, user)
                  return !actions[type] ? null : actions[type]()
                } else {
                  return null
                }
              },
            })
            service.apply(app, app)
            return null
          },
          {
            hooks: {
              before: {
                find: [h.data.safeFindMSSQL],
                create: [
                  // this actually works, provide an error if the user is not verified, but obviously this won't work here, so do not uncomment it here, just example of how its being called
                  // AuthManagement.hooks.isVerified(),
                  h.common.when(
                    isAction(['passwordChange', 'identityChange']),
                    h.auth.authenticate('jwt')
                  ),
                ],
              },
            },
          }
        )
        // meta user for multi jwt auth
        s(
          'meta-users',
          (app) => {
            const entityService = (params) =>
              t.eq(
                'node-xmlhttprequest',
                t.to.lowerCase(t.atOr('', 'headers.user-agent', params))
              )
                ? 'machine-account'
                : 'users'
            return {
              id: '_id',
              async get(id, params) {
                const entity = entityService(params)
                // app.debug('META USERS GET', entity, t.at('user', params))
                return await app.service(entity).get(id, params)
              },
              async find(params) {
                const entity = entityService(params)
                // app.debug('META USERS FIND', entity, t.at('user', params))
                return await app.service(entity).find(params)
              },
            }
          },
          {
            hooks: {
              before: {
                all: [h.auth.authenticate('jwt')],
              },
            },
          }
        )
        // public account status
        s(
          'account-status',
          (app) => {
            return {
              async get(_) {
                return app.get('account-status')
              },
            }
          },
          {}
        ),
          // public account verification
          s(
            'account-verification',
            (app) => {
              return {
                async get(_) {
                  return app.get('verification')
                },
              }
            },
            {}
          )
      },
      lifecycle: {
        [z.featureBox.api.lifecycle.onSetup]: (app) => {
          app.on('login', (authResult, params, context) => {
            if (isUser(t.atOr({}, 'user', authResult))) {
              patchStatus(app, authResult.user, 'online')
                .then(() => {})
                .catch((e) => app.error('failed to update user status', e))
            }
          })
          app.on('logout', (authResult, params, context) => {
            if (isUser(t.atOr({}, 'user', authResult))) {
              patchStatus(app, authResult.user, 'offline')
                .then(() => {})
                .catch((e) => app.error('failed to update user status', e))
            }
          })
          app.prependListener('disconnect', (connection) => {
            if (isUser(t.atOr({}, 'user', connection))) {
              patchStatus(app, connection.user, 'offline')
                .then(() => {})
                .catch((e) => app.error('failed to update user status', e))
            }
          })
        },
        [z.featureBox.api.lifecycle.onSync]: (app) => {
          bootAccountStatus(app)
            .then(() => {})
            .catch((e) => app.error('failed to update account status', e))
          bootAccountVerification(app)
            .then(() => {})
            .catch((e) =>
              app.error(
                'failed to set forceVerification status from the authentication field in the server config',
                e
              )
            )
        },
      },
    })
  )
}
