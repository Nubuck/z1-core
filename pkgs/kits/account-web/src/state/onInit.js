import z from '@z1/lib-feature-box'

// main
export const onInit = z.fn((t) => (_, props) => (ctx) => {
  ctx.dispatch(ctx.mutators.boot())
  const api = t.at(t.atOr('api', 'apiAt', props), ctx)
  api.io.on('connect', () => {
    ctx.dispatch(ctx.mutators.connection(true))
  })
  api.io.on('disconnect', () => {
    ctx.dispatch(ctx.mutators.connection(false))
  })
})
