import machineAccountCore from '@z1/kit-machine-account-server-core'

// main
export default z =>
  machineAccountCore(z, {
    adapter: 'nedb',
    models(m) {
      m(['nedb', 'machine'])
      m(['nedb', 'machine_login'])
    },
    serviceFactory: {
      machines: { id: '_id', modelName: 'machine' },
      machineLogins: { id: '_id', modelName: 'machine_login' },
    },
  })
