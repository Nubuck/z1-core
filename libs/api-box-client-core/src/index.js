import { task } from '@z1/preset-task'
import {
  Feathers,
  FeathersIO,
  IO,
  FeathersAuth,
} from '@z1/preset-feathers-client'

export const createApiClient = task(t => props => {
  const client = Feathers()
  client.configure(
    FeathersIO(
      IO(props.path, {
        pingTimeout: 50000,
        timeout: 50000,
        requestTimeout: 20000,
        // transports: props.polling ? ['polling'] : ['websocket'],
        // forceNew: true,
        reconnect: true,
      })
    )
  )
  client.configure(
    FeathersAuth(
      t.merge(
        {
          storage: !t.has('storage')(props) ? undefined : props.storage,
        },
        !t.has('auth')(props) ? {} : props.auth
      )
    )
  )
  if (t.eq('Function', t.type(t.path(['configure'], props)))) {
    client.configure(props.configure)
  }
  return client
})

export const Task = task
