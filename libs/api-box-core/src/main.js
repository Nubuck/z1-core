import { task } from '@z1/preset-task'

// parts
import { api } from './api'
import { box } from './box'
import { server } from './server'
import { common } from './common'

// main
export const apiBoxCore = task(t => (ctx = {}) => {
  const nextCtx = t.merge(common, ctx)
  const Box = box(nextCtx)
  const Api = api(t.merge({ box: Box }, nextCtx))
  const Server = server(t.merge({ api: Api }, nextCtx))
  return t.merge(Box, {
    api: Api,
    server: Server,
  })
})
