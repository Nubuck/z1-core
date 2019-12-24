import { task } from '@z1/preset-task'

// parts
import { api } from './api'
import { box } from './box'
import { servers } from './servers'
import { common } from './common'

// main
export const apiBoxCore = task(t => (ctx = {}) => {
  const nextCtx = t.merge(common, ctx)
  const Box = box(nextCtx)
  const Api = api(t.merge(Box, nextCtx))
  const Servers = servers(t.merge({ api: Api }, nextCtx))
  return t.mergeAll([
    Box,
    {
      configure: Api,
    },
    Servers,
  ])
})
