import { featureBox } from '@z1/lib-feature-box-server-nedb'

// api
import { api } from './api'

// main
export const feature = featureBox.create(ctx => ({
  name: 'machineAccount',
  api: [api(ctx)],
}))
