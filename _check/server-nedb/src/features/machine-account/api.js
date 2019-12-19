import { apiBox } from '@z1/lib-feature-box-server-nedb'

// main
export const api = () =>
  apiBox.create({
    models(m) {
      return [m(['nedb', 'machine'])]
    },
    services(s, h) {
      const baseHook = [h.auth.authenticate('jwt')]
      return [
        s(
          ['nedb', 'machines'],
          m => ({
            Model: m.machine,
          }),
          {
            hooks: {
              before: {
                get: baseHook,
                find: [h.auth.authenticate('jwt'), h.data.safeFindMSSQL],
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
        app.debug('machine auth')
      },
    },
  })
