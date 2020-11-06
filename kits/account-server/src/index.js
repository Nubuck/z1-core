import core from '@z1/kit-account-server-core'

// main
export default (z, props = {}) =>
  core(
    z,
    z.featureBox.fn((t) =>
      t.merge(
        {
          adapter: 'knex',
          models(m) {
            m(['knex', 'users'], async (db) => {
              const exists = await db.schema.hasTable('users')
              if (t.not(exists)) {
                await db.schema.createTable('users', (table) => {
                  table.uuid('_id').primary()
                  table.string('username')
                  table.string('name')
                  table.string('surname')
                  table.string('email').unique()
                  table.string('password')
                  table.string('role')
                  table.string('status')
                  table.boolean('isVerified')
                  table.string('verifyToken')
                  table.string('verifyShortToken')
                  table.date('verifyExpires')
                  table.json('verifyChanges')
                  table.string('resetToken')
                  table.date('resetExpires')
                  table.datetime('createdAt')
                  table.datetime('updatedAt')
                })
              }
            })
          },
          serviceFactory: { modelName: 'users' },
        },
        props
      )
    )
  )
