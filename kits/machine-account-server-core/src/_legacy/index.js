import { createKit } from '@z1/lib-feature-box-server-core'

import { machineAccountApi } from './main'
import { machineAuthHooks } from './parts'

// exports
export default createKit({ models: null, createApiBox: null }, props => {
  return {
    name: 'machineAccount',
    api: [machineAccountApi(props)],
    hooks: {
      authHooks: machineAuthHooks,
    },
  }
})
