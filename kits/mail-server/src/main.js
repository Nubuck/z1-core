import z from '@z1/lib-feature-box-server'

// parts
import { api } from './api'
import { communicate } from './communicate'

// main
export const feature = z.create('mail', (ctx) => {
  return {
    api: [api(ctx)],
    parts: { communicate },
  }
})

export default feature
