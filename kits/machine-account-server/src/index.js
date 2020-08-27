import core from '@z1/kit-machine-account-server-core'

// main
export default (z, props = {}) =>
  core(
    z,
    z.featureBox.fn((t) =>
      t.merge(
        {
          adapter: 'knex',
          models(m) {
            m(['knex', 'machine'], async (db) => {
              const exists = await db.schema.hasTable('machine')
              if (t.not(exists)) {
                await db.schema.createTable('machine', (table) => {
                  table.uuid('_id')
                  table.datetime('createdAt')
                  table.datetime('updatedAt')
                  table.string('hardwareuuid')
                  table.string('serialnumber')
                  table.string('manufacturer')
                  table.string('model')
                  table.string('hashId')
                  table.integer('cpus')
                  table.integer('cores')
                  table.string('timezone')
                  table.string('type')
                  table.string('platform')
                  table.string('release')
                  table.string('arch')
                  table.string('distro')
                  table.string('hostSerialnumber')
                  table.string('alias')
                })
              }
            })
            m(['knex', 'machine_login'], async (db) => {
              const exists = await db.schema.hasTable('machine_login')
              if (t.not(exists)) {
                await db.schema.createTable('machine_login', (table) => {
                  table.uuid('_id')
                  table.datetime('createdAt')
                  table.datetime('updatedAt')
                  table.string('hostname')
                  table.string('username')
                  table.string('role')
                  table.string('machineHashId')
                  table.string('hashId')
                  table.string('version')
                  table.uuid('machineId')
                  table.string('status')
                  table.string('alias')
                })
              }
            })
          },
          serviceFactory: {
            machines: { id: '_id', modelName: 'machine' },
            machineLogins: { id: '_id', modelName: 'machine_login' },
          },
        },
        props
      )
    )
  )
