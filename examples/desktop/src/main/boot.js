import { app } from 'electron'
import path from 'path'
import z from '@z1/lib-state-box-node'
import api from '@z1/lib-api-box-client-node'
import ma from '@z1/kit-machine-account-node'

// parts
import { state } from './state'

// main
export const boot = async (apiPath = 'http://127.0.0.1:3035') => {
  const client = await api(apiPath, {
    storageOptions: { dir: path.join(app.getPath('home'), '.z1') },
  })
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
