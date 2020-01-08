import zbx from '@z1/lib-feature-box-server'

// api
import { api } from './api'

// main
export const feature = zbx.create('account', ctx => ({
  api: [api(ctx)],
}))
