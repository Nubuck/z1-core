import z from '@z1/lib-feature-box-server'

import { api } from './api'

export const feature = z.create(
  'machines',
  ctx => {
    return {
      api: [api],
    }
  },
  {}
)
