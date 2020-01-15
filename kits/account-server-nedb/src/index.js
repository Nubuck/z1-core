import accountCore from '@z1/kit-account-server-core'

// main
export default z =>
  accountCore(z, {
    adapter: 'nedb',
    models(m) {
      m(['nedb', 'users'])
    },
    serviceFactory: { modelName: 'users' },
  })
