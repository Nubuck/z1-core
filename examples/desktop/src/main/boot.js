import z from '@z1/lib-state-box-node'
import ma from '@z1/kit-machine-account-node'

// parts
import { api } from './api'
import { state } from './state'

// main
export const boot = async (apiPath = 'http://localhost:3035') => {
  const client = await api(apiPath)
  const store = z.store.create({
    boxes: state,
    context: {
      api: client,
      machine: ma.machine,
      sysInfo: ma.sysInfo,
    },
    logging: process.env.NODE_ENV === 'development',
  })
  return store
}
