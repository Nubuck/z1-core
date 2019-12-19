import { featureBox } from '@z1/lib-feature-box-server-core'
import { api } from './api'

export default featureBox.create(
  props => {
    return {
      name: 'account',
      api: [api(props)],
      tasks: {},
    }
  },
  { adapter:'nedb', models: null, apiBox: { create: () => null } }
)
