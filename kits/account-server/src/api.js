import { createApiBox, task } from '@z1/lib-feature-box-sql'
import AuthManagement from 'feathers-authentication-management'

import { communicate } from './mails'

const isAction = task(
  t => actions => hook => !!t.find(
    action => t.eq(action, hook.data.action),
    actions,
  ),
)

export const accountApi = createApiBox({
  models(m, T) {
    return [
      m('users', {
          id: {
            type: T.UUID,
            primaryKey: true,
          },
          username: {
            type: T.STRING,
            allowNull: true,
          },
          name: {
            type: T.STRING,
            allowNull: true,
          },
          surname: {
            type: T.STRING,
            allowNull: true,
          },
          email: {
            type: T.STRING,
            allowNull: false,
          },
          password: {
            type: T.STRING,
            allowNull: false,
          },
          role: {
            type: T.STRING,
            allowNull: true,
          },
          profile: {
            type: T.STRING,
            allowNull: true,
          },
          status: {
            type: T.STRING,
            allowNull: true,
          },
          isVerified: {
            type: T.BOOLEAN,
          },
          verifyToken: {
            type: T.STRING,
          },
          verifyExpires: {
            type: T.DATE,
          },
          verifyChanges: {
            // type: T.JSON,
            type: T.TEXT,
            set(val) {
              this.setDataValue('verifyChanges', JSON.stringify(val))
            },
            // get() {
            //   return JSON.parse(this.getDataValue('verifyChanges'))
            // },
          },
          resetToken: {
            type: T.STRING,
          },
          resetExpires: {
            type: T.DATE,
          },
        },
        {
          hooks: {
            beforeCount(options) {
              options.raw = true
            },
          },
        },
      ),
    ]
  },
  services(s, models, { auth, common, data }) {
    return [
      s('users', {
          Model: models.users,
        },
        {
          hooks: {
            before: {
              find: [
                auth.authenticate('jwt'),
                // NOTE: ALLOW ADMINS
                auth.restrictToOwner({
                  idField: 'id',
                  ownerField: 'id',
                }),
                data.safeFindMSSQL,
              ],
              get: [
                auth.authenticate('jwt'),
                // NOTE: ALLOW ADMINS
                auth.restrictToOwner({
                  idField: 'id',
                  ownerField: 'id',
                }),
              ],
              create: [
                auth.hashPassword(),
                data.withIdUUIDV4,
                data.withUUIDV4('username'),
                AuthManagement
                  .hooks
                  .addVerification('auth-management'),
              ],
              update: [
                // NOTE: ALLOW ADMINS
                common.disallow('external'),
              ],
              patch: [
                // NOTE: MIGRATE THIS TOO
                // common.preventChanges(
                //   common.isProvider('external'),
                //   'email',
                //   'isVerified',
                //   'verifyToken',
                //   'verifyShortToken',
                //   'verifyExpires',
                //   'verifyChanges',
                //   'resetToken',
                //   'resetShortToken',
                //   'resetExpires',
                // ),
                common.iff(
                  common.isProvider('external'),
                  [
                    auth.hashPassword(),
                    auth.authenticate('jwt'),
                    // NOTE: ALLOW ADMINS
                    auth.restrictToOwner({
                      idField: 'id',
                      ownerField: 'id',
                    }),
                  ],
                ),
              ],
              remove: [
                auth.authenticate('jwt'),
                // NOTE: ALLOW ADMINS
                auth.restrictToOwner({
                  idField: 'id',
                  ownerField: 'id',
                }),
              ],
            },
            after: {
              all: [
                auth.protect('password'),
              ],
              create: [
                // NOTE: MIGRATE TO SAFER TASK
                hook => {
                  if (!hook.params.provider) {
                    return hook
                  }
                  const user = hook.result
                  if (hook.data && hook.data.email && user) {
                    communicate(hook.app, user)[ 'resendVerifySignup' ]()
                    return hook
                  }
                  return hook
                },
                AuthManagement
                  .hooks
                  .removeVerification(),
              ],
            },
          },
        },
      ),
      s('auth-management', app => {
          const service = AuthManagement({
            service: '/users',
            path: 'auth-management',
            identifyUserProps: [ 'email' ],
            notifier(type, user) {
              const actions = communicate(app, user)
              return !actions[ type ]
                ? null
                : actions[ type ]()
            },
          })
          service.apply(app, app)
        },
        {
          hooks: {
            before: {
              find: [
                data.safeFindMSSQL,
              ],
              create: [
                common.iff(
                  isAction([
                    'passwordChange',
                    'identityChange',
                  ]),
                  [
                    auth.authenticate('jwt'),
                    // NOTE: ALLOW ADMINS
                    auth.restrictToOwner({ ownerField: 'id' }),
                  ],
                ),
              ],
            },
          },
        },
      ),
    ]
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
