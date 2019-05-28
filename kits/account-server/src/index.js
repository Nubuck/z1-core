import { createKit } from '@z1/lib-feature-box-sql'
import { accountApi } from './api'
import { communicate } from './mails'

export default createKit(
  { /* default props */ },
  ({ /* instance props*/ }) => {
    return {
      name: 'account',
      api: [ accountApi ],
      tasks: {
        communicate,
      },
    }
  },
)