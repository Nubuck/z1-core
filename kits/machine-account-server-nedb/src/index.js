import machineAccountCore from '@z1/kit-machine-account-server-core'

// main
export default z =>
  machineAccountCore(z, {
    adapter: 'nedb',
    models(m) {
      m(['nedb', 'machine'])
      m(['nedb', 'machine_user'])
    },
    serviceFactory: {
      machines: { modelName: 'machine' },
      machineUsers: { modelName: 'machine_user' },
    },
  })
