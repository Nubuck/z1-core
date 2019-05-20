import { createKit } from '@z1/lib-feature-box-server'
import { storageApi } from './api'

export default createKit(
  { /* default props */ },
  ({ /* instance props*/ }) => {
    return {
      name: 'bucketStorage',
      api: [ storageApi ],
    }
  },
)