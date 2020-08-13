import accountCore from '@z1/kit-account-server-core'

// main
export default (z, props = {}) =>
  accountCore(
    z,
    z.featureBox.fn((t) =>
      t.merge(
        {
          adapter: 'nedb',
          models(m) {
            m(['nedb', 'users'])
          },
          serviceFactory: { id: '_id', modelName: 'users' },
        },
        props
      )
    )
  )
