import core from '@z1/kit-bucket-storage-server-core'

// main
const name = 'bucket_registry'
export default (z, props = {}) =>
  core(
    z,
    z.featureBox.fn((t) =>
      t.merge(
        {
          adapter: 'knex',
          models(m) {
            m(['knex', name], async (db) => {
              const exists = await db.schema.hasTable(name)
              if (t.not(exists)) {
                await db.schema.createTable(name, (table) => {
                  table.uuid('_id').primary()
                  table.string('fileId')
                  table.string('mimeType')
                  table.string('fileType')
                  table.string('originalName')
                  table.string('encoding')
                  table.string('ext')
                  table.integer('size')
                  table.uuid('createdBy')
                  table.string('creatorRole')
                  table.uuid('updatedBy')
                  table.string('updaterRole')
                  table.datetime('createdAt')
                  table.datetime('updatedAt')
                  table.text('extra', 'longtext')
                })
              }
            })
          },
          serviceFactory: { modelName: name },
        },
        props
      )
    )
  )
