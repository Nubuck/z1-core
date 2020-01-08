import AuthManagement from 'feathers-authentication-management'

// tasks
import { isAction } from './tasks'

// main
export const api = ({ adapter, models, apiBox, serviceFactory }) =>
  apiBox.create('account', {
    models,
    services(s, { auth, common, data }) {
      s([adapter, 'users'], serviceFactory, {
        hooks: {
          before: {
            find: [
              auth.authenticate('jwt'),
              // NOTE: ALLOW ADMINS
              // auth.restrictToOwner({
              //   idField: 'id',
              //   ownerField: 'id',
              // }),
              data.safeFindMSSQL,
            ],
            get: [
              auth.authenticate('jwt'),
              // NOTE: ALLOW ADMINS
              // auth.restrictToOwner({
              //   idField: 'id',
              //   ownerField: 'id',
              // }),
            ],
            create: [
              auth.hashPassword('password'),
              // data.withIdUUIDV4,
              // data.withUUIDV4('username'),
              AuthManagement.hooks.addVerification('auth-management'),
            ],
            update: [
              // NOTE: ALLOW ADMINS
              common.disallow('external'),
            ],
            patch: [
              common.iff(common.isProvider('external'), [
                auth.hashPassword('password'),
                auth.authenticate('jwt'),
                // NOTE: ALLOW ADMINS
                // auth.restrictToOwner({
                //   idField: 'id',
                //   ownerField: 'id',
                // }),
              ]),
            ],
            remove: [
              auth.authenticate('jwt'),
              // NOTE: ALLOW ADMINS
              // auth.restrictToOwner({
              //   idField: 'id',
              //   ownerField: 'id',
              // }),
            ],
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
                  // NOTE: ALLOW ADMINS
                  // auth.restrictToOwner({ ownerField: 'id' }),
                ]),
              ],
            },
          },
        }
      )
    },
    // channels(app) {
    //   console.log('CONFIGURE BOX CHANNEL')
    // },
    // lifecycle:{
    //   authConfig(app){
    //
    //   }
    // }
  })
