import * as core from '@z1/lib-api-box-client-core'
import { default as localforage } from 'localforage'

export const createApiClient = core.Task(
  t => props => core.createApiClient(
    t.merge(
      {
        storage: localforage,
      },
      props,
    ),
  ),
)