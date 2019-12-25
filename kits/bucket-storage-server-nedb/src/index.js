import { featureBox } from '@z1/lib-feature-box-server-nedb'
import bucketStorageFeatureCore from '@z1/kit-bucket-storage-server-core'

// main
export default () =>
  bucketStorageFeatureCore({
    adapter: 'nedb',
    apiBox: featureBox.api,
    models(m) {
      m(['nedb', 'bucket_registry'])
    },
    serviceFactory(m) {
      return {
        Model: m.bucket_registry,
      }
    },
  })
