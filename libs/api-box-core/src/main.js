import { task } from '@z1/preset-task'

// parts
import { api } from './api'
import { box } from './box'
import { server } from './server'
import { common } from './common'

// main
export const apiBoxCore = task(t => (ctx = {}) => {
  const nextCtx = t.merge(common, ctx)

  return {
    box: null,
    api: null,
    server: null,
  }
})
