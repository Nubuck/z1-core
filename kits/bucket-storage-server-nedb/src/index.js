import apiBox from '@z1/lib-api-box-nedb'
import bucketStorageCore from '@z1/kit-bucket-storage-server-core'

// main
export default () =>
  bucketStorageCore({
    adapter: 'nedb',
    apiBox,
    models(m) {
      m(['nedb', 'bucket_registry'])
    },
    serviceFactory: { modelName: 'bucket_registry' },
  })
