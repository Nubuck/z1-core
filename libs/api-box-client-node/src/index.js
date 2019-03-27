import * as core from './client'
import nodePersist from 'node-persist'

export const createApiClient = core.Task(t => async props => {
  const options = {
    dir: './storage',
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    // can also be custom logging function
    logging: false,
    // ttl* [NEW], can be true for 24h default or a number in MILLISECONDS
    ttl: false,
    // every 2 minutes the process will clean-up the expired cache
    expiredInterval: 2 * 60 * 1000,
    // in some cases, you (or some other service) might add non-valid
    // storage files to your storage dir, i.e. Google Drive, make this true
    // if you'd like to ignore these files and not throw an error
    forgiveParseErrors: false,
  }
  await nodePersist.init(
    t.merge(
      options,
      t.not(t.has('storageOptions')(props)) ? {} : props.storageOptions
    )
  )
  return core.createApiClient(
    t.merge(props, {
      storage: nodePersist,
    })
  )
})
