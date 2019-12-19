import { createKit } from '@z1/lib-feature-box-server-core'
import { accountApi } from './api'
import { communicate } from './mails'

export default createKit({ models: null, createApiBox: null }, props => {
  return {
    name: 'account',
    api: [accountApi(props)],
    tasks: {
      communicate,
    },
  }
})
