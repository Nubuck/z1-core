import AuthManagement from 'feathers-authentication-management'

// main
export const api = (z, props) => {
  const dbId = z.featureBox.fn(t =>
    t.eq(props.adapter, 'nedb') ? '_id' : 'id'
  )
  const isAction = z.featureBox.fn(t => (actions = []) => hook => {
    return t.notNil(t.find(action => t.eq(action, hook.data.action), actions))
  })
  const isUser = z.featureBox.fn(t => user =>
    t.allOf([t.has('name')(user), t.has('surname')(user), t.has('email')(user)])
  )
  const patchStatus = z.featureBox.fn((t, a) => async (app, user, status) => {
    await a.of(app.service('users').patch(user[dbId], { status }))
  })
  return z.featureBox.fn((t, a) =>
    z.featureBox.api.create('account', {
      models: props.models,
      services(s, h) {
        s([props.adapter, 'users'], props.serviceFactory, {
          hooks: {
            before: {
              find: [h.auth.authenticate('jwt'), h.data.safeFindMSSQL],
              get: [h.auth.authenticate('jwt')],
              create: [
                h.auth.hashPassword('password'),
                AuthManagement.hooks.addVerification('auth-management'),
              ],
              update: [h.common.disallow('external')],
              patch: [
                h.common.when(
                  h.common.isProvider('external'),
                  h.auth.hashPassword('password'),
                  h.auth.authenticate('jwt')
                ),
              ],
              remove: [h.auth.authenticate('jwt')],
            },
            after: {
              all: [h.auth.protect('password')],
              create: [
                hook => {
                  if (!hook.params.provider) {
                    return hook
                  }
                  // const user = hook.result
                  // if (hook.data && hook.data.email && user) {
                  // communicate(hook.app, user)['resendVerifySignup']()
                  // return hook
                  // }
                  return hook
                },
                AuthManagement.hooks.removeVerification(),
              ],
            },
          },
        })
        s(
          'auth-management',
          app => {
            const service = AuthManagement({
              service: '/users',
              path: 'auth-management',
              identifyUserProps: ['email'],
              notifier(type, user) {
                // const actions = communicate(app, user)
                // return !actions[type] ? null : actions[type]()
                return null
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
          app => {
            const entityService = params =>
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
      },
      lifecycle: {
        [z.featureBox.api.lifecycle.onSetup]: app => {
          app.on('login', (authResult, params, context) => {
            if (isUser(t.atOr({}, 'user', authResult))) {
              patchStatus(app, authResult.user, 'online')
                .then(() => {})
                .catch(e => app.error('failed to updated user status', e))
            }
          })
          app.on('logout', (authResult, params, context) => {
            if (isUser(t.atOr({}, 'user', authResult))) {
              patchStatus(app, authResult.user, 'offline')
                .then(() => {})
                .catch(e => app.error('failed to updated user status', e))
            }
          })
          app.on('disconnect', connection => {
            if (isUser(t.atOr({}, 'user', connection))) {
              patchStatus(app, connection.user, 'offline')
                .then(() => {})
                .catch(e => app.error('failed to updated user status', e))
            }
          })
        },
      },
    })
  )
}
