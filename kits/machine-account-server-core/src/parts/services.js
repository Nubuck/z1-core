import { task } from '@z1/lib-feature-box-server-core'

// main
export const services = task(
  (t, a) => ({ FeathersErrors }) => (s, m, { auth, data, common }) => {
    return [
      s(
        'machines',
        {
          Model: m.machines,
        },
        {
          hooks: {
            before: {
              get: [auth.authenticate('jwt')],
              find: [auth.authenticate('jwt'), data.safeFindMSSQL],
              create: [
                async ctx => {
                  const [existsError, existsResult] = await a.of(
                    ctx.service.find({
                      query: {
                        hashId: ctx.data.hashId,
                      },
                    })
                  )
                  if (existsError) {
                    ctx.app.error(
                      'ERROR CHECKING MACHINE HASH ID ON CREATE',
                      existsError
                    )
                  }
                  if (t.gt(existsResult.total, 0)) {
                    throw new FeathersErrors.GeneralError(
                      'Machine already registered'
                    )
                  }
                  return ctx
                },
                common.when(common.isProvider('external'), ctx => {
                  ctx.data['role'] = 'robot'
                  ctx.data['status'] = 'offline'
                  return ctx
                }),
              ],
              patch: [auth.authenticate('jwt')],
              update: [auth.authenticate('jwt')],
              remove: [auth.authenticate('jwt')],
            },
            after: {},
          },
        }
      ),
    ]
  }
)
