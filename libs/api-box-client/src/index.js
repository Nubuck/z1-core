import * as core from '@z1/lib-api-box-client-core'
import { default as localforage } from 'localforage'

export const apiClient = core.task(t => props =>
  core.apiClient(
    t.merge(
      {
        storage: localforage,
      },
      props
    )
  )
)
