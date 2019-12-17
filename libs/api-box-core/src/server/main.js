import { task } from '@z1/preset-task'

// parts
import { api } from './api'
import { app } from './app'

// main
export const server = task(t => ctx => {
  return {
    app: null,
    api: null,
  }
})
