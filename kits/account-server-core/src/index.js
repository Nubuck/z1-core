import { featureBox } from '@z1/lib-feature-box-server-core'
import { api } from './api'

export default featureBox.create(
  'account',
  props => {
    return {
      api: [api(props)],
      tasks: {},
    }
  },
  {
    adapter: 'nedb',
    models: null,
    apiBox: { create: () => null },
    serviceFactory: () => ({}),
  }
)
