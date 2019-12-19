import { featureBox } from '@z1/lib-feature-box-server'

// api
import { api } from './api'

// main
export const feature = featureBox.create(ctx => ({
  name: 'account',
  api: [api(ctx)],
}))
