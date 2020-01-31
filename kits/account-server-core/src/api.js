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
      services(s, { auth, common, data }) {
        s([props.adapter, 'users'], props.serviceFactory, {
          hooks: {
            before: {
              find: [auth.authenticate('jwt'), data.safeFindMSSQL],
              get: [auth.authenticate('jwt')],
              create: [
                auth.hashPassword('password'),
                AuthManagement.hooks.addVerification('auth-management'),
              ],
              update: [common.disallow('external')],
              patch: [
                common.when(
                  common.isProvider('external'),
                  auth.hashPassword('password'),
                  auth.authenticate('jwt')
                ),
              ],
              remove: [auth.authenticate('jwt')],
            },
            after: {
              all: [auth.protect('password')],
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
                find: [data.safeFindMSSQL],
                create: [
                  common.when(
                    isAction(['passwordChange', 'identityChange']),
                    auth.authenticate('jwt')
                  ),
                ],
              },
            },
          }
        )
      },
      lifecycle: {
        [z.featureBox.api.lifecycle.onSetup]: app => {
          app.on('login', (authResult, params, context) => {
            if (isUser(authResult.user)) {
              patchStatus(app, authResult.user, 'online')
                .then(() => app.debug('user online', authResult.user[dbId]))
                .catch(e => app.error('failed to updated user status', e))
            }
          })
          app.on('logout', (authResult, params, context) => {
            if (isUser(authResult.user)) {
              patchStatus(app, authResult.user, 'offline')
                .then(() => app.debug('user offline', authResult.user[dbId]))
                .catch(e => app.error('failed to updated user status', e))
            }
          })
          app.on('disconnect', connection => {
            if (isUser(connection.user)) {
              patchStatus(app, connection.user, 'offline')
                .then(() => app.debug('user offline', connection.user[dbId]))
                .catch(e => app.error('failed to updated user status', e))
            }
          })
        },
      },
    })
  )
}
