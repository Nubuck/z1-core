import z from '@z1/lib-feature-box-server'

// main
export const lifecycle = z.fn((t, a) => (ctx) => ({
  onSync(app) {
    app.debug('mail storage synced')
  },
}))
export default lifecycle
