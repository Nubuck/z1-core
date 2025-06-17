import z from '@z1/lib-feature-box-server'
import FeathersMailer from 'feathers-mailer'
// main
export const services = z.fn((t, a) => ({ hooks }) => {
  return (s, h) => {
    s(
      'mail',
      (app) => {
        const mail = app.get('mail')
        if (t.not(mail)) {
          app.set('communication', 'inactive')
        } else {
          const endPoint = '/mail'
          const transport = t.at('transport', mail)
          if (t.eq(transport, 'smtp')) {
            const smtpAuth = app.get('smtp')
            if (smtpAuth) {
              app.debug('Mailer is active')
              app.use(endPoint, FeathersMailer(smtpAuth))
              app.set('communication', 'active')
            }
          } else {
            app.set('communication', 'inactive')
          }
        }
      },
      {
        hooks: {
          before: {
            all: [h.common.disallow('external')],
            create: [],
            patch: [],
          },
          after: {
            get: [],
            find: [],
            create: [
              async (hook) => {
                const transport = t.at('transport', hook.app.get('mail'))

                const deliveryPayload = t.mergeAll([
                  {
                    transport,
                    pending: 1,
                  },
                  t.omit(['meta'], hook.data),
                  { error: hook.error },
                  t.omit(['_id'], hook.result),
                ])

                const pl = t.pick(
                  [
                    'transport',
                    'from',
                    'to',
                    'subject',
                    'messageTime',
                    'messageSize',
                    'messageId',
                    'response',
                    'accepted',
                    'rejected',
                    'pending',
                  ],
                  deliveryPayload
                )

                const [reportError] = await a.of(
                  hook.app.service('mail-delivery').create(pl)
                )

                if (reportError) {
                  hook.app.error('MAIL DELIVERY ERROR', reportError)
                  hook.app.error('PAYLOAD DUMP', pl)
                }
                return hook
              },
            ],
            patch: [],
            remove: [],
          },
        },
      }
    )
  }
})
export default services
