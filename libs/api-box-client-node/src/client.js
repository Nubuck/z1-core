import { task as fn } from '@z1/preset-task'
import {
  Feathers,
  FeathersIO,
  IO,
  FeathersAuth,
} from '@z1/preset-feathers-client-node'

export const api = fn(t => (path = '/', props = {}) => {
  const client = Feathers()
  const ioClient = t.has('options')(props)
    ? IO(path, props.options)
    : IO(path)
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
        t.not(t.has('auth')(props)) ? {} : props.auth
      )
    )
  )
  if (t.eq('Function', t.type(t.path(['configure'], props)))) {
    client.configure(props.configure)
  }
  return client
})

export const task = fn
