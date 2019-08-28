import { createApiBox, FeathersErrors } from '@z1/lib-feature-box-server-nedb'
import bucketStorageFeatureCore from '@z1/kit-bucket-storage-server-core'

// main
export default () =>
  bucketStorageFeatureCore({
    createApiBox,
    models(m) {
      return [m('bucket_registry')]
    },
    FeathersErrors,
  })
