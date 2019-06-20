import { createApiBox } from '@z1/lib-feature-box-server-nedb'
import accountFeatureCore from '@z1/kit-account-server-core'

// main
export default () =>
  accountFeatureCore({
    createApiBox,
    models(m) {
      return [m('users')]
    },
  })
