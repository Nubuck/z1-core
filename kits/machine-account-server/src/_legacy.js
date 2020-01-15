import { createApiBox, FeathersErrors } from '@z1/lib-feature-box-server'
import machineAccountFeatureCore from '@z1/kit-machine-account-server-core'

// main
export default () =>
  machineAccountFeatureCore({
    createApiBox,
    models(m, T) {
      return [
        m(
          'machines',
          {
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
          },
          {
            hooks: {
              beforeCount(options) {
                options.raw = true
              },
            },
          }
        ),
      ]
    },
    FeathersErrors,
  })
