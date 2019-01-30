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
        transports: props.polling ? ['polling'] : ['websocket'],
        reconnect: true,
      }),
      {
        pingTimeout: props.pingTimeout || 5000,
        timeout: props.timeout || 5000,
        requestTimeout: props.requestTimeout || 5000,
      }
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
