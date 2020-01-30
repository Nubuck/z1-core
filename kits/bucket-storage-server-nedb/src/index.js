import bucketStorageCore from '@z1/kit-bucket-storage-server-core'

// main
export default z =>
  bucketStorageCore(z, {
    adapter: 'nedb',
    models(m) {
      m(['nedb', 'bucket_registry'])
    },
    serviceFactory: {id: '_id', modelName: 'bucket_registry' },
  })
