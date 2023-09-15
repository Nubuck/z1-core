import { task } from '@z1/preset-task'
import { fromEvent, of } from 'rxjs'
import {
  filter,
  tap,
  map,
  switchMap,
  merge,
  takeUntil,
  catchError,
} from 'rxjs/operators'

// parts
import { api } from './api'
import { lifecycle } from './api/types'
import { box } from './box'
import { servers } from './servers'
import { common } from './common'

// main
export const Fn = task((t, a) => factory =>
  factory(t, a, {
    of,
    fromEvent,
    filter,
    tap,
    map,
    switchMap,
    merge,
    takeUntil,
    catchError,
  })
)

export const apiBoxCore = Fn(t => (ctx = {}) => {
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
    { lifecycle, hooks: common.commonHooks },
  ])
})
