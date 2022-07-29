import z from '@z1/lib-feature-box-server'

// main
export const models = z.fn((t, a) => (m) => {
  const name = 'mail-delivery'
  m(['knex', name], async (db) => {
    const exists = await db.schema.hasTable(name)
    if (t.not(exists)) {
      await db.schema.createTable(name, (table) => {
        table.uuid('_id').primary()
        table.datetime('createdAt')
        table.datetime('updatedAt')
        table.string('transport')
        table.string('from')
        table.string('to')
        table.string('subject')
        table.text('html', 'longtext')
        table.text('envelope', 'longtext')
        table.integer('envelopeTime')
        table.integer('messageTime')
        table.integer('messageSize')
        table.uuid('messageId')
        table.text('message')
        table.text('response')
        table.text('accepted')
        table.text('rejected')
        table.text('pending')
        table.text('error')
      })
    }
  })
})
export default models
