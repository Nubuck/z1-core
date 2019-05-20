import { createKit } from '@z1/lib-feature-box-server'
import { mailApi } from './api'

export default createKit(
  { /* default props */ },
  ({ /* instance props*/ }) => {
    return {
      name: 'mail',
      api: [ mailApi ],
    }
  },
)