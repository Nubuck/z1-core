import apiCore from '@z1/lib-api-box-client-core'
import { default as localforage } from 'localforage'

const api = core.task(t => props =>
  apiCore(
    t.merge(
      {
        storage: localforage,
      },
      props
    )
  )
)
export const apiClient = api
export default api
