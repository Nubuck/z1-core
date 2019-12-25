import { createKit } from '@z1/lib-feature-box-server-core'
import { storageApi } from './api'

export default createKit({ models: null, createApiBox: null }, props => {
  return {
    name: 'bucketStorage',
    api: [storageApi(props)],
  
  }
})
