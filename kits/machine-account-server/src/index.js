import machineAccountCore from '@z1/kit-machine-account-server-core'

// main
export default z =>
  machineAccountCore(z, {
    adapter: 'sequelize',
    models(m) {
      m(['sequelize', 'machine'], (define, T) =>
        define({
          hashId: {
            type: T.STRING,
            allowNull: false,
          },
          type: {
            type: T.STRING,
            allowNull: false,
          },
          platform: {
            type: T.STRING,
            allowNull: false,
          },
          manufacturer: {
            type: T.STRING,
            allowNull: false,
          },
          model: {
            type: T.STRING,
            allowNull: false,
          },
          hardwareuuid: {
            type: T.STRING,
            allowNull: false,
          },
          serialnumber: {
            type: T.STRING,
            allowNull: false,
          },
          hostname: {
            type: T.STRING,
            allowNull: false,
          },
          username: {
            type: T.STRING,
            allowNull: false,
          },
          distro: {
            type: T.STRING,
            allowNull: true,
          },
          hostSerialnumber: {
            type: T.STRING,
            allowNull: true,
          },
          alias: {
            type: T.STRING,
            allowNull: true,
          },
          home: {
            type: T.STRING,
            allowNull: true,
          },
          arch: {
            type: T.STRING,
            allowNull: true,
          },
          release: {
            type: T.STRING,
            allowNull: true,
          },
          timezone: {
            type: T.STRING,
            allowNull: true,
          },
          cpus: {
            type: T.INTEGER,
            allowNull: true,
          },
          cores: {
            type: T.INTEGER,
            allowNull: true,
          },
          role: {
            type: T.STRING,
            allowNull: false,
          },
          status: {
            type: T.STRING,
            allowNull: true,
          },
          ipAddress: {
            type: T.STRING,
            allowNull: true,
          },
        }, {
          hooks: {
            beforeCount(options) {
              options.raw = true
            },
          },
        })
      )
      m(['sequelize', 'machine_user'], (define, T) =>
        define({
          hashId: {
            type: T.STRING,
            allowNull: false,
          },
        }, {
          hooks: {
            beforeCount(options) {
              options.raw = true
            },
          },
          associate(m) {},
        })
      )
    },
    serviceFactory: {
      machines: { modelName: 'machine' },
      machineUsers: { modelName: 'machine_user' },
    },
  })
