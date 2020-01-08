import zbx from '@z1/lib-feature-box-server'

// main
export const api = () =>
  zbx.api.create('account', {
    models(m) {
      return [
        m(['sequelize', 'user'], (define, T) =>
          define({
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
              type: T.TEXT,
              set(val) {
                this.setDataValue('verifyChanges', JSON.stringify(val))
              },
            },
            resetToken: {
              type: T.STRING,
            },
            resetExpires: {
              type: T.DATE,
            },
          }, {
            hooks: {
              beforeCount(options) {
                options.raw = true
              },
            },
          })
        ),
      ]
    },
    services(s, h) {
      const baseHook = []
      return [
        s(
          ['sequelize', 'users'],
          { modelName: 'user' },
          {
            hooks: {
              before: {
                get: baseHook,
                find: [],
                create: [],
                patch: baseHook,
                update: baseHook,
                remove: baseHook,
              },
            },
          }
        ),
      ]
    },
    lifecycle: {
      authConfig(app) {
        app.debug('auth')
      },
    },
  })
