import { featureBox } from '@z1/lib-feature-box-server-nedb'
import accountFeatureCore from '@z1/kit-account-server-core'

// main
export default () =>
  accountFeatureCore({
    adapter: 'nedb',
    apiBox: featureBox.api,
    models(m) {
      m(['nedb', 'users'])
    },
    serviceFactory: { modelName: 'users' },
  })
