import { task } from '@z1/preset-task'
import {
  Feathers,
  FeathersIO,
  IO,
  FeathersAuth,
} from '@z1/preset-feathers-client-node'

export const createApiClient = task(t => props => {
  const client = Feathers()
  const ioClient = t.has('options')(props)
    ? IO(props.path, props.options)
    : IO(props.path)
  const feathersClient = t.has('timeout')(props)
    ? FeathersIO(ioClient, props.timeout)
    : FeathersIO(ioClient)
  client.configure(feathersClient)
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
