import { createApiBox, FeathersErrors } from '@z1/lib-feature-box-server-nedb'
import machineAccountFeatureCore from '@z1/kit-machine-account-server-core'

// main
export default () =>
  machineAccountFeatureCore({
    createApiBox,
    models(m) {
      return [m('machines')]
    },
    FeathersErrors,
  })
