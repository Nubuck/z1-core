import AuthManagement from 'feathers-authentication-management'

// main
export const api = (z, props) => {
  const isAction = z.featureBox.fn(t => (actions = []) => hook =>
    t.notNil(t.find(action => t.eq(action, hook.data.action), actions))
  )
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
                common.iff(common.isProvider('external'), [
                  auth.hashPassword('password'),
                  auth.authenticate('jwt'),
                ]),
              ],
              remove: [auth.authenticate('jwt')],
            },
            after: {
              all: [auth.protect('password')],
              create: [
                // NOTE: MIGRATE TO SAFER TASK
                hook => {
                  if (!hook.params.provider) {
                    return hook
                  }
                  const user = hook.result
                  if (hook.data && hook.data.email && user) {
                    // communicate(hook.app, user)['resendVerifySignup']()
                    return hook
                  }
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
                app.debug('Account notifier', action, user.enail)
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
                  common.iff(isAction(['passwordChange', 'identityChange']), [
                    auth.authenticate('jwt'),
                  ]),
                ],
              },
            },
          }
        )
      },
      lifecycle: {
        [z.featureBox.api.lifecycle.onSetup]: app => {
          app.on('login', (authResult, params, context) => {
            app.debug(
              'ACCOUNT LOGIN',
              t.keys(authResult),
              t.keys(params),
              t.keys(context)
            )
          })
          app.on('logout', (authResult, params, context) => {
            app.debug(
              'ACCOUNT LOGOUT',
              t.keys(authResult),
              t.keys(params),
              t.keys(context)
            )
          })
          app.on('disconnect', connection => {
            app.debug('ACCOUNT DISCONNECT', t.keys(connection))
          })
        },
      },
    })
  )
}
