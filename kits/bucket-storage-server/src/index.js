import { featureBox } from '@z1/lib-feature-box-server'
import bucketStorageFeatureCore from '@z1/kit-bucket-storage-server-core'

// main
export default () =>
  bucketStorageFeatureCore({
    adapter: 'sequelize',
    apiBox: featureBox.api,
    models(m) {
      m(['sequelize', 'bucket_registry'], (define, T) =>
        define({
          id: {
            type: T.UUID,
            primaryKey: true,
          },
          fileId: {
            type: T.STRING,
            allowNull: false,
          },
          mimeType: {
            type: T.STRING,
            allowNull: false,
          },
          originalName: {
            type: T.STRING,
            allowNull: false,
          },
          encoding: {
            type: T.STRING,
          },
          size: {
            type: T.INTEGER,
            allowNull: false,
          },
          folderId: {
            type: T.UUID,
          },
        }, {
          hooks: {
            beforeCount(options) {
              options.raw = true
            },
          },
        })
      )
    },
    serviceFactory: {
      modelName: 'bucket_registry',
    },
  })
