import apiCore, { task } from '@z1/lib-api-box-client-core'
import { default as localforage } from 'localforage'

const api = task(t => (path, props = {}) =>
  apiCore(
    path,
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
