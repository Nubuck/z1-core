import zbx from '@z1/lib-feature-box-server'

import { api } from './api'

export const feature = zbx.create(
  'machines',
  ctx => {
    return {
      api: [api],
    }
  },
  {}
)
