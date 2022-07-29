// parts
import { api } from './api'
import { app } from './app'

// main
export const servers = ctx => {
  return { server: api(ctx), app: app(ctx) }
}
