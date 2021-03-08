import z from '@z1/lib-feature-box-server'

// main
export const services = z.fn((t, a) => ({ hooks }) => {
  return (s, h) =>
    s(
      ['knex', 'mail-delivery'],
      { modelName: 'mail-delivery' },
      {
        hooks: {
          before: {
            all: [h.auth.authenticate('jwt')],
            create: [
              h.data.withIdUUIDV4,
              h.common.setNow('createdAt', 'updatedAt'),
            ],
            patch: [h.common.setNow('updatedAt')],
          },
          after: {
            get: [],
            find: [],
            create: [],
            patch: [],
            remove: [],
          },
        },
      }
    )
})
export default services
