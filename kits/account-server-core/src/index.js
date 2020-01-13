import { featureBox } from '@z1/lib-feature-box-server-core'
import { api } from './api'

export default featureBox.create(
  'account',
  props => {
    return {
      api: [api(props)],
      hooks: {},
      parts: {},
    }
  },
  {
    adapter: 'nedb',
    models: null,
    apiBox: { create: () => null },
    serviceFactory: () => ({}),
  }
)
